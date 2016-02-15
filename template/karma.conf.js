/* jshint node: true */
'use strict';

module.exports = function(config) {
    config.set({
        autoWatch: true,

        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['dots', 'coverage'],
        plugins: ['karma-coverage'],

        files: [
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
