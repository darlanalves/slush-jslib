/**
 * <%= nameSlug %>
 */

(function(global) {

	var Lib = {};

	// ...

	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Lib;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Lib;
	} else {
		global.Lib = Lib;
	}

})(this);
