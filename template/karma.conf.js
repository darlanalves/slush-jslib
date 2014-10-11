module.exports = function(config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['jasmine'],
		files: ['src/**/*.js', 'test/**/*.spec.js']
	});
};
