
var state = 0;
chrome.browserAction.setIcon({path:"icon" + state + ".png"});


chrome.browserAction.onClicked.addListener(function() {
    var action = {data: null};

    if(state === 0){
        state = 1;
        action.data = "startSelector";
    }
    else if(state === 1){
        state = 0;
        action.data = "endSelector";
    }

    /* Notify the tabs of the current action to take */
    communicator.notify('iconClicked', action);
    
    /* Update the icon based on the current state */
    chrome.browserAction.setIcon({path:"icon" + state + ".png"});
});