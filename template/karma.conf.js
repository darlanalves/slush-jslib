/* jshint node: true */
'use strict';

module.exports = function(config) {
    config.set({
        autoWatch: true,

        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['dots', 'coverage'],

        files: [
            require.resolve('babel-polyfill/browser.js'),
            'dist/<%= nameSlug %>.js',
            'test/**/*.spec.js'
        ],

        preprocessors: {
            'dist/<%= nameSlug %>.js': ['coverage'],
            'test/**/*.js': ['babel']
        },

        coverageReporter: {
            dir: 'test/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
    });
};
