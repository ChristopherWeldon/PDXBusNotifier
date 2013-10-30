function App() {
	/**
	 * Root of app
	 */
	 
	 "use strict";
	 
	var self = this;
	self.settings = new SettingsModle();
	
	/**
	 * Calculate difference between two dates
	 *  @param 2 numbers, strings or Dates
	 *  @returns int Seconds between dates
	 */
	this.calcDateDiff = function(d1, d2) {
		// If the first date is a string or number, create a date object based on the string
		if ( typeof d1 === 'string' || typeof d1 === 'number') {
			d1 = new Date(d1);
		}

		// If the seconds date is a string or number, create a date object based on the string
		if ( typeof d2 === 'string' || typeof d2 === 'number') {
			d2 = new Date(d2);
		}

		// Convert dates to timestamp
		var d1_milliseconds = d1.getTime();
		var d2_milliseconds = d2.getTime();

		// Calculate difference and convert it to number of milliseconds between midnight of January 1, 1970
		var diff = d1_milliseconds - d2_milliseconds;
		diff = Math.round(diff / 1000);

		return diff;
	};
	
	/**
	 * Convert seconds to human friendly time
	 * @param int seconds of time diff
	 * @returns string of time
	 */
	this.convertTimeDiff = function(seconds) {
		var displayTime;
		
		if (seconds > (60 * 60)) {
			displayTime = (Math.round(seconds / (60 * 60), 2)) + "h"
		} else if (seconds > (60 * 1)) {
			displayTime = (Math.round(seconds / (60 * 1), 2)) + "m"
		} else {
			displayTime = Math.round(seconds, 2) + "s"
		}

		return displayTime;
	};

	/**
	* Filter only results the use wants based on route settings
	*/
	this.filterResultSet = function(resultSetMap){
		var filter = self.settings.routes();
		var filterResults = Array();
		
		if(filter.length > 0){
			
			// Convert filter to array to allow easy checking
			filter = filter.split(',');
			$.each(resultSetMap['resultSet'].arrival,function(index, value) {
				if(filter.indexOf(value.route.toString()) > -1)
				{
					filterResults.push(value);
				} 
			});
			
			//replace result set with filter set
			resultSetMap['resultSet'].arrival = filterResults
		}
		
		return resultSetMap;
	};
	
	/**
	 * Get data from local storage
	 */
	this.getDataFromLocal = function() {
		
		var storeName = self.settings.localStorageName;
		var localDataString = localStorage[storeName];
		var localDataJSON = JSON.parse(localDataString);
		
		return localDataJSON.resultSet.arrival;
	};

	/**
	 * Get data from the server using jQuery $.ajax
	 */
	this.getDataFromServer = function() {
		var resultSet;
		//AJAX Callback

		// Error
		var onRequestError = function(jqXHR, textStatus, thrownError) {
			console.log("AJAX Error in App (" + textStatus + "): ", jqXHR);
			self.writeErrorToBadge(jqXHR.statusText);
			resultSet = "Error";
		}
		// Success
		var onRequestSuccess = function(data, textStatus, jqXHR) {
			
            var filter_results = self.filterResultSet(data);

            var arrivalSetString = JSON.stringify(data);
            filter_results = JSON.stringify(filter_results);

			// Store data in local storage
			window.localStorage.clear();
			localStorage["arrivalResultSet"] = arrivalSetString;

			resultSet =  data.resultSet.arrival;
		}
		// AJAX request
		var request = $.ajax({
			async: false,
			url : self.settings.requestArrivalURL(),
			success : onRequestSuccess,
			error : onRequestError
		});
		
		
		return resultSet;
	};	
		
	/**
	 * Get data from either local storage if data is still valid otherwise get data from server  
	 */
	this.getData = function(){
		var resultSet;
		
		if(self.isLocalStorageValid())
		{
			resultSet = self.getDataFromLocal();
		}
		else{
			resultSet = self.getDataFromServer();
		}
		
		return resultSet;
	};


	/**
	 * Get the earliest time from result set
	 * @param JSON result set
	 */
	this.getEarliestItem = function(resultSet) {
		var earliestTime, timeToCompare, firstArrival;

		$.each(resultSet, function(index, item) {

			// Check the status so we know what time to compare to
			if (item.status === "estimated") {
				timeToCompare = item.estimated;
			} else {
				timeToCompare = item.scheduled;
			}

			// If this time is sooner or if we do not have an earliest time yet set it to current value
			if (timeToCompare < earliestTime || typeof earliestTime === "undefined") {
				earliestTime = timeToCompare;
				firstArrival = item;
			}

		});

		return firstArrival;
	};
	
	/**
	 * Get the unit of the arrival time diff
	 * @param timeDiff, string arrival time difference with last string as unit. 
	 * @returns String, hour(s), minute(s) second(s)
	 */
	this.getTimeDiffUnit = function(timeDiff){
		var timeUnit;
		//We just need the last char
		var lastChar = timeDiff.substring(timeDiff.length, timeDiff.length- 1);
		timeDiff = timeDiff.substring(0, timeDiff.length- 1);
		
		switch(lastChar){
			case('s'):
				if(timeDiff > 1){
					timeUnit =' seconds';
				}
				else{
					timeUnit =' second';
				} 
				break;				
			case('m'):
				if(timeDiff > 1){
					timeUnit =' minutes';
				 }
				else{
					timeUnit =' minute';
				} 
			break;				
			case('h'):
				if(timeDiff > 1){
					timeUnit =' hours';
				 }
				else{
					timeUnit +=' hour';
				} 
				break;
			}	
			
			return timeUnit;		
	}
	
	/**
	 * Verify the data in local storage is still relevant
	 * @returns bool, true if data in local storage is still relevant
	 */
	this.isLocalStorageValid = function() {
		var storeName = self.settings.localStorageName;
		var isValid = false;
		var localArrivalResultSet = localStorage[storeName];
		
		if (typeof localArrivalResultSet == "undefined") {
			isValid = false;
		} 
		else {

			localArrivalResultSet = JSON.parse(localArrivalResultSet);
			var now = new Date();

			// How much time has elapsed since the last query to the server
			var queryTime = localArrivalResultSet.resultSet.queryTime;
			var queryTimeDiff = self.calcDateDiff(now, queryTime);

			// How much time (if any) has elapsed since the first arrival was due for the last arrival result set
			var firstArrival = self.getEarliestItem(localArrivalResultSet.resultSet.arrival);			
			// Check the status so we know what time to compare to
			var firstArrivalTime;
			if (firstArrival.status === "estimated") {
				firstArrivalTime = firstArrival.estimated;
			} else {
				firstArrivalTime = firstArrival.scheduled;
			}
			
			var arrivalTimeDiff = self.calcDateDiff(firstArrivalTime, now);

			if (queryTimeDiff > (60 * 60) || arrivalTimeDiff < (60 * 5)) {
				isValid = false;
			} else {
				isValid = true;
			}
		}
		
		return isValid;

	};	
	
	this.writeErrorToBadge = function(errorText){
	             chrome.browserAction.setBadgeText({
                text : 'Err'
         });
         
         chrome.browserAction.setTitle({
            title : errorText
        });	
	}
	
	/**
	 * Create hash based on Java's has code
	 * Code take from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/ 
	 */
	this.hashCode = function(value){
        var hash = 0,i,char;
        if (value.length == 0) return hash;
        for (i = 0; i < value.length; i++) {
            char = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;	    
	}
};	