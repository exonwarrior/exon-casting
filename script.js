$( document ).ready(function(){
	var loadCastInterval = setInterval(function(){
		if(chrome.cast.isAvailable){
			console.log('Cast has loaded.');
			clearInterval(loadCastInterval);
			initializeCastApi();
		} else {
			console.log('Unavailable.');
		}
	}, 1000};
});