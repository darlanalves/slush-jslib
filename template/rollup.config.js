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

if (process.env.BUNDLE) {
    plugins.push(uglify());
}

module.exports = {
    entry: './src/index.js',
    format: 'cjs',
    dest: 'dist/<%= nameSlug %>.js',
    plugins: plugins
};
