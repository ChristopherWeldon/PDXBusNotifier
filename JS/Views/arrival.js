var ext = ext || {};

$(function() {'use strict';

	// Arrival Item View
	// --------------

	// The DOM element for a todo item...
	ext.ArrivalView = Backbone.View.extend({
				//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template( $('#list-template').html() ),

		initialize: function() {
			
		},
		
		// Re-render
		render: function() {			
			this.$el.html( this.template( this.model.toJSON() ) );
			$('#inner_arrival_list').append(this.$el);
			return this;
		},		
		 add : function(arrival) {
		    // We create an updating view for each that is added.
		    var dv = new ext.ArrivalView({
		      tagName : 'li',
		      model : arrival
		    })
		 },		
	})
}); 