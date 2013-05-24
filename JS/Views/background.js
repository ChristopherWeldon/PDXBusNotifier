/**
 * Badge actions
 */

function Badge() {
	"use strict";

	var self = this;
	self.currentArrival
	self.settings = new SettingsModle();
	self.app = new App();
	self.activeNotes = new Array();
	self.notificationCounts = 0;
	self.currentArrivalHash;
	self.systemState;
	
	/**
	 * Display time
	 * @param string to display
	 * @param shouldDisplayNotification should display notification
	 */
	this.displayArrival = function(displayTime,shouldDisplayNotification) {
	    chrome.browserAction.setBadgeText({
                text : ' '+displayTime+' '
         });

        self.setBadgeColor(displayTime,shouldDisplayNotification, shouldDisplayNotification);
	}	
	
	/**
	 * Set color of badges 
	 */
	this.setBadgeColor = function(time, shouldDisplayNotification){
	    var timeAsInt = parseInt(time);

	    if(timeAsInt < self.settings.startNotesTime() && time.indexOf("m") > 0 && shouldDisplayNotification){
            chrome.browserAction.setBadgeBackgroundColor({                
                color : [208, 0, 24, 255]                
            });	        
	    }
	    else{
            chrome.browserAction.setBadgeBackgroundColor({                
                color:[0, 62, 16, 255]
            }); 	        
	    }
	}
	
	/**
	 *Set title 
	 */
	this.setBadgeTitle = function(){
	    var arrivalTime;
	    
	    if(typeof  self.currentArrival.estimated != "undefined"){
	       arrivalTime = new Date(self.currentArrival.estimated)    
	    }
        else{
           arrivalTime = new Date(self.currentArrival.scheduled)
        }
        
        var route = self.currentArrival.route;
        var title = "Bus: "+ route+" @ "+arrivalTime.toLocaleTimeString();

        chrome.browserAction.setTitle({
            title : title
        });	
	}
	
	/**
	 *Build notification 
	 */
	this.displayNotification = function(arrivalDiff,arrivalTimeUnit){
        //check hash here   
        // Create a has based on the estimated arrival and the route
        var hashCodeForthisArrival = self.currentArrival.estimated+''+self.currentArrival.route;

        var thisArrivalHash = self.app.hashCode(hashCodeForthisArrival.toString());      
  
        if(self.settings.notiftEnable() || typeof self.settings.notiftEnable()  == "undefined"){
        // Create a has based on the estimated arrival and the route
            var hashCode = self.currentArrival.estimated+''+self.currentArrival.route;

            self.currentArrivalHash = self.app.hashCode(hashCode.toString());              
            if(self.notificationCounts < self.settings.maxNotes()){

                var notificationContent = self.currentArrival.route+ ' will be here in '+arrivalDiff+' '+arrivalTimeUnit;
                
                //Make sure the system is active before building notification
                chrome.idle.queryState(2 * 60 * 1000, function(state) {
                    if(state == 'active'){
                        var popup = window.webkitNotifications.createNotification('http://trimet.org/images/trimet-logo-iphone.png', 'Notification', notificationContent);
                        popup.show();
                        self.notificationCounts = self.notificationCounts + 1
                            // Auto close after 5 seconds
                        popup.ondisplay = function() {
                            setTimeout(function() {
                                popup.cancel();
                            }, 5 * 1000);
                        }
                    }
                });                 
            }  	    
        }
	}

	/**
	 * Convert seconds to human friendly time
	 * @returns string of time
	 */
	this.getDisplayTime = function() {

		var seconds, displayTime;
		var now = new Date();

		if (self.currentArrival.status === 'estimated') {
			seconds = self.app.calcDateDiff(self.currentArrival.estimated, now);
		} else {
			seconds = self.app.calcDateDiff(self.currentArrival.scheduled, now);
		}

		if (seconds > (60 * 60)) {
			displayTime = (Math.round(seconds / (60 * 60), 2)) + "h"
		} else if (seconds > (60 * 1)) {
			displayTime = (Math.round(seconds / (60 * 1), 2)) + "m"
		} else {
			displayTime = Math.round(seconds, 2) + "s"
		}

		return displayTime;
	}

	/**
	 * Get earilest arrival time
	 */
	this.getArrival = function() {
		var resultSet = self.app.getData();
		
		self.currentArrival = self.app.getEarliestItem(resultSet);			
	}

	this.init = function() {
        self.getArrival();
        self.settings.getLocalSettings();
               
        var timeDiff;
        var now = new Date();
        
        if (self.currentArrival.status === 'estimated') {
            timeDiff = self.app.calcDateDiff(self.currentArrival.estimated, now);
        } else {
            timeDiff = self.app.calcDateDiff(self.currentArrival.scheduled, now);
        }       

        var arrivalDiff = self.app.convertTimeDiff(timeDiff);
        var arrivalTimeUnit = self.app.getTimeDiffUnit(arrivalDiff);
        arrivalDiff = arrivalDiff.substring(0, arrivalDiff.length- 1);
        
        if(typeof self.settings.notyTime() != "undefined")
        {            
            var time = self.settings.convertTimeToInt(self.settings.notyTime());
            var timeToDisplay = new Date(now.getMonth()+1+"/"+now.getDate()+"/"+now.getFullYear()+" "+time);
            
			var t1 = now >= timeToDisplay;
			console.log("now >= timeToDisplay: ",t1);
			console.log("now: ",now);
			console.log("timeToDisplay: ",timeToDisplay);
			
            var shouldDisplayNotification = (timeDiff/60) < (self.settings.startNotesTime()) && now >= timeToDisplay && (timeDiff/60) > self.settings.stopNotesTime();

            if(shouldDisplayNotification)
            {
                self.displayNotification(arrivalDiff,arrivalTimeUnit);
            }            
        }
        
        var displayTime = self.app.convertTimeDiff(timeDiff);
        
        self.displayArrival(displayTime,shouldDisplayNotification);
        self.setBadgeTitle();     		
	}	
	   
};

var badge = new Badge();
badge.init();
setInterval(badge.init,60 * 1000);
