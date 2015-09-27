(function(global) {
	'use strict';

	<content>

	// TODO: replace MyLibrary with the actual library name

	if (typeof define === 'function' && define.amd) {
		define(function() {
			return MyLibrary;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = MyLibrary;
	} else {
		global.MyLibrary = MyLibrary;
	}

})(this);
