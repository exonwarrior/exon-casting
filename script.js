var session = null;
var currentMediaSession = null;

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

$('#stop').click(function(){
	stopApp();
});

$('#change').click(function(){
	loadMedia();
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
	if (session.media.length != 0) {
		console.log('Found ' + session.media.length + ' existing media sessions.');
		onMediaDiscovered('onRequestSessionSuccess_', session.media[0]);
	}
	session.addMediaListener(onMediaDiscovered.bind(this, 'addMediaListener'));
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
	session.addUpdateListener(sessionUpdateListener.bind(this));
	session.addMediaListener(onMediaDiscovered.bind(this, 'addMediaListener'));
	loadMedia();
}

function onLaunchError() {
	console.log("Error connecting to the Chromecast.");
}

function loadMedia() {
	if (!session) {
		console.log("No session.");
		return;
	}
	
	var mediaInfo = new chrome.cast.media.MediaInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/ED_1280.mp4');
    mediaInfo.contentType = 'video/mp4';
	
	/*
	The following two lines are an earlier example from the tutorial.
	They have been replaced by the two lines above, from a later section
	in the same tutorial.
	
	var mediaInfo = new chrome.cast.media.MediaInfo('http://i.imgur.com/IFD14.jpg');
	mediaInfo.contentType = 'image/jpg';
	*/
	var request = new chrome.cast.media.LoadRequest(mediaInfo);
	request.autoplay = true;
	
	session.loadMedia(request, onMediaDiscovered.bind(this, 'loadMedia'), onLoadError);
}

function onLoadSuccess() {
	console.log('Successfully loaded image.');
}

function onLoadError() {
	console.log('Failed to load image.');
}

function stopApp() {
	session.stop(onStopAppSuccess, onStopAppError);
}

function onStopAppSuccess() {
	console.log('Successfully stopped app.');
}

function onStopAppError() {
	console.log('Error stopping app.');
}

function sessionUpdateListener(isAlive) {
	var message = isAlive ? 'Session Updated' : 'Session Removed';
	message += ': ' + session.sessionId;
	console.log(message);
	
	if(!isAlive) {
		session = null;
	}
}

function onMediaDiscovered(how, media) {
        console.log("New media session ID:" + media.mediaSessionId + ' (' + how + ')');
        currentMediaSession = mediaSession;
        document.getElementById("playpause").innerHTML = 'Pause';
}

function playMedia() {
	if( !currentMediaSession ) {
		return;
	}
	
	var playpause = document.getElementById("playpause");

	if( playpause.innerHTML == 'Play' ) {
		currentMediaSession.play(null,
		mediaCommandSuccessCallback.bind(this,"playing started for " + currentMediaSession.sessionId),onLoadError);
		playpause.innerHTML = 'Pause';
	}
	else {
		if( playpause.innerHTML == 'Pause' ) {
			currentMediaSession.pause(null,
			mediaCommandSuccessCallback.bind(this,"paused " + currentMediaSession.sessionId),onLoadError);
			playpause.innerHTML = 'Play';
		}
	}
}