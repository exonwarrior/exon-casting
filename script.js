var session = null;

$( document ).ready(function(){
	var loadCastInterval = setInterval(function(){
		if(chrome.cast.isAvailable){
			console.log('Cast has loaded.');
			clearInterval(loadCastInterval);
			initializeCastApi();
		} else {
			console.log('Unavailable.');
		}
	}, 1000);
});

$('#castme').click(function(){
	launchApp();
});

function initializeCastApi() {
	var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
	var sessionRequest = new chrome.cast.SessionRequest(applicationID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
	chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
};

function sessionListener(e){
	session = e;
	console.log('New session');
	if(session.media.length != 0){
		console.log('Found ' + session.media.length + ' sessions.');
	}
}

function receiverListener(e){
	if( e=== 'available' ) {
		console.log("Chromecast was found on the network.");
	}
	else {
		console.log("There are no Chromecasts available.");
	}
}

function onInitSuccess() {
	console.log("Initialization suceeded");
}

function onInitError() {
	console.log("Initialization failed");
}

function launchApp() {
	console.log("Launching the Chromecast App...");
	chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
	console.log("Successfully created session: " + e.sessionId);
	session = e;
}

function onLaunchError() {
	console.log("Error connecting to the Chromecast.");
}