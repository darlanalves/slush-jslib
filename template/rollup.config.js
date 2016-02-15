/* jshint node: true */
'use strict';

var commonjs = require('rollup-plugin-commonjs');
var npm = require('rollup-plugin-npm');
var uglify = require('rollup-plugin-uglify');
var json = require('rollup-plugin-json');
var babel = require('rollup-plugin-babel');
var includePaths = require('rollup-plugin-includepaths');

var includePathOptions = {
    include: {},
    paths: ['src'],
    external: [],
    extensions: ['.js', '.json']
};

var namedExports = {};

var plugins = [
    commonjs({ namedExports, include: ['node_modules/**'] }),
    includePaths(includePathOptions),
    npm({ jsnext: false, main: true, browser: true }),
    json(),
    babel({ exclude: 'node_modules/**' })
];

var destPath = 'dist/<%= nameSlug %>.js';

if (process.env.BUNDLE) {
    plugins.push(uglify());
    destPath = 'dist/<%= nameSlug %>.min.js'
}


module.exports = {
    entry: './src/index.js',
    format: 'umd',
    dest: destPath,
    moduleName: '<%= nameCased %>',
    plugins: plugins
};
