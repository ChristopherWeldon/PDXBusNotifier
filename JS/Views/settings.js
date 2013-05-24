"use strict";

/**
 *Display a message on the screen 
 * @param String/HTML message
 * @param jQuery Object to append message to $page
 */
function createOverlay(message, $page) {
    var overlayWrapper = '<div id="mod-overlay">' + message + '</div>';
    $page.append(overlayWrapper);   
        
    $('#mod-overlay').delay(500).fadeOut(250, function() {
        $(this).remove();
    });

}

$(function() {

    // Set up knockout JS
    var settings = new SettingsModle();

    settings.getLocalSettings();

    ko.applyBindings(settings);

    console.log("noty set: ", settings.notiftEnable());
    if (settings.notiftEnable() == true || typeof settings.notiftEnable() == "undefined") {
        console.log("setting checked");
        $('#notiftEnable').attr('checked', 'checked');
    } else {
        console.log("remove check");
        $('#notiftEnable').removeAttr('checked');
    }

    // UI widgets
    // Time picker
    $('#notifyTime').timepicker({
        'scrollDefaultNow' : true,
        'step' : 10
    });

    //iOS/iPhone checkboxes
    $('#notiftEnable').iphoneStyle({
        onChange : function(elem, value) {
            settings.setNotifyEnable(value);
        }
    });

    $('#submit').click(function(event) {
        event.preventDefault();
        settings.putDataInLocal();
        settings.getLocalSettings();
        createOverlay('Your settings have been saved', $('form'));
    });

});
