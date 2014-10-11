/* jshint node: true */
'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	multipipe = require('multipipe'),
	sourcemaps = require('gulp-sourcemaps'),
	karma = require('karma').server,
	version = require('./package.json').version;

function buildRelease() {
	console.log('Building version ' + version);
	multipipe(
		gulp.src('src/**/*.js'),
		sourcemaps.init(),
		uglify(),
		sourcemaps.write('.'),
		gulp.dest('dist'),
		onError
	);
}

function runTests(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
}

function tdd(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js'
	}, done);
}

function onError(err) {
	if (err) {
		console.warn(err.message || err);
		if (err.stack) console.log(err.stack);
	}
}

gulp.task('build', ['test'], buildRelease);
gulp.task('tdd', tdd);
gulp.task('test', runTests);
gulp.task('default', ['tdd']);
