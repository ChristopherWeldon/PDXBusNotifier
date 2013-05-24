function PopupViewModel() {
	"use strict";
	
	var self = this;
	self.arrivals = ko.observableArray([]);
	self.settings = new SettingsModle();
	self.app = new App();

	/**
	 * Add values from result set to ko.obserableArry to display
	 */
	this.displayArrivals = function() {

		var resultSet = self.app.getData();
		if (resultSet != "Error") {

			var mappedArrivals = $.map(resultSet, function(item) {
				return new Arrival(item)
			});

			self.arrivals(mappedArrivals);			
		}
		else{	
		}
	}
	
	self.displayArrivals();
}

// Activates knockout.js
ko.applyBindings(new PopupViewModel());
