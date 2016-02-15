/* jshint node:true */
'use strict';

var gulp = require('gulp'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    multipipe = require('multipipe'),
    async = require('async'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    fs = require('fs'),
    path = require('path');

gulp.task('default', function(exit) {
    var basename = path.basename(process.cwd());

    function run(oldAnswers) {
        oldAnswers = oldAnswers || {};

        var configPrompts = [{
            name: 'name',
            message: 'Library name:',
            default: oldAnswers.name || basename
        }, {
            name: 'description',
            message: 'Description:',
            default: oldAnswers.description || undefined
        }, {
            name: 'version',
            message: 'Version:',
            default: oldAnswers.version || '0.0.0'
        }, {
            name: 'author',
            message: 'Author (name <email>):',
            default: oldAnswers.author || undefined
        }, {
            name: 'repository',
            message: 'Git repository (user/repo):',
            default: oldAnswers.repository || undefined
        }];

        getAnswers(configPrompts, function(err, config) {
            if (err) {
                return exit();
            }

            var _config = {
                name: config.name,
                description: config.description,
                version: config.version,
                author: config.author,
                repository: config.repository,
            };

            console.log(JSON.stringify(_config, null, '  '));
            console.log('\n\n');

            inquirer.prompt([{
                name: 'confirm',
                message: 'Is this OK?',
                type: 'confirm',
                default: true
            }], function(answer) {
                if (!answer.confirm) {
                    return run(config);
                }

                getRepository(config);
                getAuthor(config);

                async.series([
                    function(callback) {
                        console.log('Making manifest files');
                        try { saveManifestFiles(config, callback); }
                        catch (e) { callback(e); }
                    },

                    function(callback) {
                        console.log('Copying files');
                        try { copyTemplateFiles(config, callback); }
                        catch (e) { callback(e); }
                    }
                ], function(error) {
                    if (error) {
                        console.log('[error] ', error);
                    } else {
                        console.log('[done]');
                        console.log('-- Don`t forget to install npm modules --');
                    }

                    exit();
                });
            });
        });
    }

    function getAnswers(prompts, callback) {
        var cwd = process.cwd();
        var manifest = path.join(cwd, 'package.json');

        if (fs.existsSync(manifest)) {
            var projectJson = require(manifest);

            try {
                prompts.forEach(function(o) {
                    var name = o.name,
                        value = projectJson[o.name];

                    if (!(name in projectJson) || value === undefined) return;

                    if (name === 'author' && typeof value === 'object') {
                        value = value.name + ' <' + value.email + '>';
                    }

                    if (name === 'repository' && typeof value === 'object') {
                        value = value.url;
                    }

                    o.default = value;
                });
            } catch (e) {
                console.log(e);
            }
        }

        inquirer.prompt(prompts,
            function(answers) {
                if (!answers.name) {
                    return callback(true);
                }

                answers.nameSlug = _.slugify(answers.name);
                callback(null, answers);
            }
        );
    }

    function saveManifestFiles(answers, callback) {
        runSteps([
            gulp.src(__dirname + '/manifest/*.json'),
            template(answers),
            conflict('./'),
            gulp.dest('./')
        ], callback);
    }

    function copyTemplateFiles(answers, callback) {
        runSteps([
            gulp.src(__dirname + '/template/**'),
            template(answers),
            rename(function(file) {
                if (file.basename[0] === '_') {
                    file.basename = '.' + file.basename.slice(1);
                }
            }),
            conflict('./'),
            gulp.dest('./')
        ], callback);
    }

    function runSteps(steps, callback) {
        steps.push(cb);
        multipipe(steps);

        function cb(error) {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, true);
        }
    }

    function getRepository(answers) {
        var repository = answers.repository;

        if (!repository) {
            answers.repository = '""';
            return;
        }

        if (/^[^\/]+\/.+$/.test(repository)) {
            repository = 'https://github.com/' + repository;
        }

        repository = {
            type: 'git',
            url: repository
        };

        answers.repository = stringify(repository);
    }

    function getAuthor(answers) {
        var author = answers.author;

        if (!author) {
            answers.author = '""';
            return;
        }

        if (/</.test(author)) {
            author = author.split('<');

            author = {
                name: author[0].trim(),
                email: author[1].replace('>', '').trim()
            };

            answers.author = stringify(author);
        }
    }

    function stringify(json) {
        return JSON.stringify(json, null, '    ');
    }

    run();
});
