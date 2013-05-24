function Arrival(data) {
	//Arrival modle, for docs read: http://developer.trimet.org/ws_docs/arrivals_ws.shtml
	// Estimated time of arrival
	this.estimated = ko.observable(data.estimated);
	
    // Time to display  
    this.estimatedToString = ko.computed({
        read : function() {
            var d =  new Date(this.estimated())
            return d.toLocaleDateString();
        },
        write : function(value) {
            //display to screen
            return this.estimated(value);
        },
        owner : this        
    }); 
    
    	
	// Schedule time of arrival
	this.scheduled = ko.observable(data.scheduled);

    // Time to display
    this.scheduledToString = ko.computed({
        read : function() {
            var d =  new Date(this.scheduled())
            return d.toLocaleDateString();
        },
        write : function(value) {
            //display to screen
            return this.scheduled(value);
        },
        owner : this        
    });	
    
	// The short version of text from the overhead sign of the vehicle when it arrives at the stop.
	this.shortSign = ko.observable(data.shortSign);

	/*
	 location	Contains information about a location, usually a stop. This element can occur in two locations in a resultSet document. One to describe the stop requested, and others to describe the location of any layovers.
	 location[@desc]	The public location description of the stop.
	 location[@dir]	The direction of traffic at the stop.
	 location[@lat]	The latitude of the stop.
	 location[@lng]	The longitude of the stop.
	 location[@locid]	LocationID of the stop.
	 */
	this.location = ko.observable(data.location);
	/*
	 four possible values:
	 estimated = arrival time was estimated with vehicle position information
	 scheduled = scheduled arrival time is available only. No real time information available for estimation. Bus's radio may be down or vehicle may not be in service. Arrivals are not estimated when further than an hour away.
	 delayed = status of service is uncertain.
	 canceled = scheduled arrival was canceled for the day
	 */
	this.status = ko.observable(data.status);
	// The last known position of the vehicle along its block. Includes path information from this position to the stop requested.
	this.block = ko.observable(data.block);

	/*
	 blockPosition	The last known position of the vehicle along its block. Includes path information from this position to the stop requested.
	 blockPosition[@at]	The time this position was reported.
	 blockPosition[@feet]	Number of feet the vehicle is away from the stop at the time the position was reported.
	 blockPosition[@heading]	The heading of the vehicle at the time of the position was reported.
	 blockPosition[@lat]	The latitude of the vehicle at the time the position was reported.
	 blockPosition[@lng]	The longitude of the vehicle at the time the position was reported.
	 */
	this.blockPosition = ko.observable(data.blockPosition);
	// 	Indicates if the vehicle has begun the trip which will arrival at the requested stop.
	this.departed = ko.observable(data.departed);
	// Indicates if the arrival may be effected by a detour in effect along the route.
	this.detour = ko.observable(data.detour);
	// The direction of the route for this arrival.
	this.dir = ko.observable(data.dir);
	// The full text of the overhead sign of the vehicle when it arrives at the stop.
	this.fullSign = ko.observable(data.fullSign);
	// The locID of the arrival.
	this.locid = ko.observable(data.locid);
	// The piece of the block for this arrival.
	this.piece = ko.observable(data.piece);
	// The route number of the arrival.
	this.route = ko.observable(data.route);
	// Arrival status (i.e. if estimated or schedule only)
	this.arrivalStatus = ko.observable(data.arrivalStatus);
	// Time arrival status was lasted updated
	this.timeReported = ko.observable(data.timeReported);
	// This child of the blockPosition will occur for every layover the vehicle has between its position and the requested arrival.
	this.layover = ko.observable(data.layover);

	/*
	 routeStatus	This element occurs to indicate conditions are influencing the reporting of arrivals being reported for a route. This occurs in inclement weather conditions.
	 routeStatus[@route]	Route number of this routeStatus.
	 routeStatus[@status]	possible values:
	 estimatedOnly = Arrivals for this route are only being reported if they can be estimated within the next hour. This occurs in inclement weather conditions.
	 off = No arrivals are being reported for this route. This occurs when conditions such as snow and ice cause vehicles along the route to travel off their trip patterns. In such cases predictions are highly inaccurate or impossible.
	 */
	this.routeStatus = ko.observable(data.routeStatus);

	/*
	 trip	This child of the blockPosition will occur for every trip the vehicle must traverse to arrive at the stop requested.
	 trip[@desc]	The route's direction description of the trip.
	 trip[@destDist]	The number of feet along this trip the vehicle must traverse to arrival at the stop requested. If the vehicle must traverse the entire trip this number will always be the entire length of the trip.
	 trip[@dir]	The direction of the route of this trip.
	 trip[@pattern]	The pattern number for the trip.
	 trip[@progress]	The number of feet the vehicle has traversed along this trip's pattern.
	 trip[@route]	The route number for this trip.
	 trip[@tripNum]	The trip number of this trip. (part of the primary key of the trip table.
	 */
	this.trip = ko.observable(data.trip);
}