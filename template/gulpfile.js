/* jshint node: true */
'use strict';

var gulp = require('gulp');

function onError(error) {
    console.warn('ERROR: ' + error.message || error);
    if (error.stack) console.log(error.stack);
}

function onEnd() {
    console.log('Done.');
}

function build() {
    var rollup = require('rollup');
    var config = require('./rollup.config.js');

    return rollup.rollup(config).then(onBundle).then(onEnd, onError);

    function onBundle(bundle) {
        bundle.write({
            dest: config.dest,
            format: config.format,
            sourceMap: true
        });
    }
}

function watch() {
    gulp.watch('src/**/*.js', ['build']);
}

gulp.task('watch', watch);
gulp.task('build', build);
