const fs = require('fs');
const scanner = require('./lib/chromecast-scanner')();
const chromecastClient = require('./lib/chromecast-client')();

// start scanning for chromecasts
scanner.scan();
scanner.on('found', function (host) {
	console.log('chromecast found: ' + host);
	chromecastClient.connect(host);
	// TODO this should be temporary
	scanner.stop();
});

const videoControls = document.getElementById('video-controls');
const dropZone = document.getElementById('drop-zone');
const body = document.getElementsByTagName("BODY")[0];
body.ondragover = () => {
	return false;
};
body.ondragleave = dropZone.ondragend = () => {
	return false;
};
body.ondrop = (e) => {
	e.preventDefault();
	var media = {};
	for (let f of e.dataTransfer.files) {
		if (isFile(f)) {
			console.log('File(s) you dragged here: ', f.path);
			if (isSrt(f.path)) {
				media.subtitles = f;
			} else {
				// TODO check if it's a valid video format
				media.video = f;
			}
		}
	}

	// TODO check if chromecast-client is ready before start it...
	chromecastClient.start(media, function () {
		dropZone.style.display = 'none';
		videoControls.style.display = 'table-cell';
	});

	return false;
};

var isSrt = function (path) {
	return path.substr(-4).toLowerCase() === '.srt';
};

var isFile = function (file) {
	return fs.existsSync(file.path) && fs.statSync(file.path).isFile();
};
// video player events
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");

playButton.addEventListener("click", function (event) {
	event.preventDefault();
	pauseButton.style.display = 'initial';
	playButton.style.display = 'none';
	chromecastClient.unpause();
}, false);

pauseButton.addEventListener("click", function (event) {
	event.preventDefault();
	pauseButton.style.display = 'none';
	playButton.style.display = 'initial';
	chromecastClient.pause();
}, false);

stopButton.addEventListener("click", function (event) {
	event.preventDefault();
	pauseButton.style.display = 'none';
	playButton.style.display = 'initial';
	chromecastClient.stop();
}, false);
