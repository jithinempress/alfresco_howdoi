require([ "jquery" ], function($) {

	$(document).ready(function() {
		if ($("#how-do-i-page").length > 0) {
			require([ "HowDoILibrary" ], function(module) {
				module.init();
			});
		}
	});

});