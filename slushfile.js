/* jshint node:true */
'use strict';

var gulp = require('gulp'),
	util = require('gulp-util'),
	install = require('gulp-install'),
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
	var basename = path.basename(path.resolve('.'));

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
			message: 'Author:',
			default: oldAnswers.author || undefined
		}, {
			name: 'repository',
			message: 'Git repository:',
			default: oldAnswers.repository || undefined
		}];

		getAnswers(configPrompts, function(err, config) {
			if (err) {
				return exit();
			}

			inquirer.prompt([{
				name: 'confirm',
				message: 'Is this OK?',
				type: 'confirm',
				default: true
			}], function(answer) {
				if (!answer.confirm) {
					return run(config);
				}

				async.series([

					function(callback) {
						util.log('Making package.json');
						savePackageJson(config, callback);
					},

					function(callback) {
						util.log('Making bower.json');
						saveBowerJson(config, callback);
					},

					function(callback) {
						util.log('Copying files');
						copyTemplateFiles(config, callback);
					},

					function(callback) {
						util.log('Installing modules');
						runNpm(callback);
					}
				], function(err) {
					if (err) util.log(util.colors.red('[error] ') + err);

					exit();
				});
			});
		});
	}

	function getAnswers(prompts, callback) {
		if (fs.existsSync('./package.json')) {
			var projectJson = require('./package.json');

			try {
				prompts.forEach(function(o) {
					var name = o.name,
						value = projectJson[o.name];

					if (!(name in projectJson) || value === undefined) return;

					// special case: author is object
					if (name === 'author' && typeof value === 'object') {
						value = value.name + ' <' + value.email + '>';
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

	function savePackageJson(config, callback) {
		var json = makePackageJson(config);
		writeJson('./package.json', json, callback);
	}

	function saveBowerJson(config, callback) {
		var json = getCommonJsonConfig(config);

		json.license = 'MIT';
		json.ignore = [
			'**/.*',
			'node_modules',
			'bower_components',
			'test'
		];

		writeJson('./bower.json', json, callback);
	}

	function writeJson(file, json, callback) {
		fs.writeFile(file, JSON.stringify(json, null, '\t'), function(err) {
			callback(err, true);
		});
	}

	function copyTemplateFiles(answers, callback) {
		var pipe = multipipe(
			gulp.src(__dirname + '/template/**'),
			template(answers),
			rename(function(file) {
				if (file.basename[0] === '_') {
					file.basename = '.' + file.basename.slice(1);
				}
			}),
			conflict('./'),
			gulp.dest('./')
		);

		pipe.on('end', function() {
			util.log('Files copied');
			callback(null, true);
		});

		pipe.on('error', function(err) {
			callback(err, null);
		});
	}

	function runNpm(callback) {
		var pipe = multipipe(gulp.src('./package.json'), install());

		pipe.on('end', function() {
			util.log('Modules installed');
			callback(null, true);
		});

		pipe.on('data', function(data) {
			return data;
		});

		pipe.on('error', function(err) {
			callback(err, null);
		});
	}

	function makePackageJson(answers) {
		var json = getCommonJsonConfig(answers);

		json.devDependencies = {
			'gulp': '^3.8.6',
			'gulp-concat': '^2.3.4',
			'gulp-uglify': '^0.3.1',
			'gulp-sourcemaps': '^1.2.4',
			'multipipe': '^0.1.1',
			'karma': '^0.12.24',
			'karma-jasmine': '^0.1.5',
			'karma-phantomjs-launcher': '^0.1.4'
		};

		json.scripts = {
			'test': './node_modules/karma/bin/karma start karma.conf.js --single-run'
		};

		if (answers.repository) {
			json.repository = {
				type: 'git',
				url: answers.repository
			};
		}

		return json;
	}

	function getAuthor(answers) {
		if (answers.author) {
			if (/</.test(answers.author)) {
				var author = answers.author.split('<');

				return {
					name: author[0].trim(),
					email: author[1].replace('>', '').trim()
				};
			} else {
				return answers.author;
			}
		}
	}

	function getCommonJsonConfig(answers) {
		var json = {
			name: answers.nameSlug,
			description: answers.description,
			version: answers.version,
			main: 'src/' + answers.nameSlug + '.js'
		};

		var author = getAuthor(answers);

		if (author) {
			json.author = author;
		}

		return json;
	}

	run();
});
