function SettingsModle() {
	"use strict";

	var self = this;

	//Settings Modle
	this.apiKey = "5A746829E2472EDCE29CF3872";

	this.localStorageName = "arrivalResultSet";

	this.localStorageSettings = "settings"

	// All request share this base
	this.baseURL = "http://developer.trimet.org/ws/V1";

	// Stop IDs
	this.locIDs = ko.observable().extend({
		defaultIfNull : "868"
	});

	//What routes are we tracking:
	this.routes = ko.observable().extend({
		defaultIfNull : "8,61"
	});

	//Time to start displaying notifications
	this.notyTime = ko.observable();

	// Max notifications for a given set
	this.maxNotes = ko.observable().extend({
		defaultIfNull : 5
	});

	// Time before to start displaying notifications
	this.startNotesTime = ko.observable().extend({
		defaultIfNull : 10
	});

	// Time to stop notifications
	this.stopNotesTime = ko.observable().extend({
		defaultIfNull : 1
	});
	
	this.notiftEnable = ko.observable();

	/**
	 * Encode data as JSON string for localstorage.
	 * @returns JSON string of settings.
	 */
	this.encodeDataFromLocal = function() {
		var jsonSettings;
		jsonSettings = JSON.stringify({
			apiKey : this.apiKey,
			localStorageName : this.localStorageName,
			locIDs : this.locIDs(),
			routes : this.routes(),
			baseURL : this.baseURL,
			notyTime : this.formattedStartTime(),
			maxNotes : this.maxNotes(),
			noteStartTime : this.startNotesTime(),
			stopNotesTime : this.stopNotesTime(),
			notiftEnable : this.notiftEnable()
		});

		return jsonSettings;
	}
	/**
	 * NoteStartTime is an object, display string representation of the objects value.
	 */
	this.formattedNoteStartTime = ko.computed({
		read : function() {
			return this.startNotesTime().toString();
		},
		write : function(value) {
			//display to screen
			return this.startNotesTime(value);
		},
		owner : this
	});


    /**
     * Set the value for notify enable value 
     */
    this.setNotifyEnable = function(value){        
        this.notiftEnable(value);        
    }


	/**
	 * StartTime is an object, display string representation of the objects value.
	 */
	this.formattedStartTime = ko.computed({
		read : function() {
			return this.notyTime();
		},
		write : function(value) {
			//display to screen
			return this.notyTime(value);
		},
		owner : this
	});

	/**
	 * LocIDs is an object, display string representation of the objects value.
	 */
	this.formattedLocIDs = ko.computed({	    
		read : function() {		    
			return this.locIDs().toString();
		},
		write : function(value) {
			//display to screen
			return this.locIDs(value)
		},
		owner : this
	});

	/**
	 * Routes is an object, display string representation of the objects value.
	 */
	this.formattedRoutes = ko.computed({
		read : function() {
			return this.routes().toString();
		},
		write : function(value) {
			//display to screen
			return this.routes(value)
		},
		owner : this
	});
	
	/**
	 * Remove "am" or "pm" from a time 
	 */
	this.convertTimeToInt = function(time){
	    var timeArray = time.split(':');
	    
	    var subTimeString = timeArray[1].substring(timeArray[1].length -2,timeArray[1].length);
	    
	    var hourAsInt = parseInt(timeArray[0]);
	    var mins = timeArray[1].substring(0,timeArray[1].length -2);

	    if(subTimeString == 'pm'){
	        hourAsInt= hourAsInt +12;
	    }

	    return hourAsInt+ ":" + mins;
	}

	/**
	 * Get localstorage settings
	 */
	this.getLocalSettings = function() {
		var settingsJSONString = localStorage[self.localStorageSettings];
		// If there is a string in the localsettings, convert it to a JSON object and restore the settings
		if ( typeof settingsJSONString != 'undefined') {
			var jsonObj = JSON.parse(settingsJSONString);			
			self.restoreFromLocal(jsonObj);
		}
		else{
		    self.putDataInLocal();
		}
	}
	/**
	 * put the current settings into local storage.
	 */
	this.putDataInLocal = function() {
		var settingsString = self.encodeDataFromLocal();

		localStorage[self.localStorageSettings] = settingsString;

	}
	/**
	 * Restore settings for the local storage
	 * @param  settingsJSON JSON object of settings.
	 */
	this.restoreFromLocal = function(settingsJSON) {
		this.locIDs(settingsJSON.locIDs);
		this.routes(settingsJSON.routes);
		this.notyTime(settingsJSON.notyTime);
		this.maxNotes(settingsJSON.maxNotes);
		this.startNotesTime(settingsJSON.startNotesTime);
		this.stopNotesTime(settingsJSON.stopNotesTime);
		this.notiftEnable(settingsJSON.notiftEnable);
	}
	/**
	 * URL to requeset arrivals
	 */
	this.requestArrivalURL = ko.computed(function() {
		var arrivalRequestURL = this.baseURL + "/arrivals/appID/<APIKEY>/locIDs/<LOCID>/json/true/";

		arrivalRequestURL = arrivalRequestURL.replace('<APIKEY>', this.apiKey);
		arrivalRequestURL = arrivalRequestURL.replace('<LOCID>', this.locIDs());

		return arrivalRequestURL;
	}, this);
	
	/**
	 * Constructor 
	 */
	this.init = function() {
		self.getLocalSettings();
	}

	self.init();	

}
