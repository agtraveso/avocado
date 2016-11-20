const fs = require('fs');
const scanner = require('./lib/chromecast-scanner')();
const chromecastClient = require('./lib/chromecast-client')();

// start scanning for chromecasts
scanner.scan();
scanner.on('found', function(host) {
    console.log('chromecast found: ' + host);
    chromecastClient.connect(host);
    // TODO this should be temporary
    scanner.stop();
});

const videoControls = document.getElementById('video-controls');
const dropZone = document.getElementById('drop-zone');
dropZone.ondragover = () => {
    return false;
};
dropZone.ondragleave = dropZone.ondragend = () => {
    return false;
};
dropZone.ondrop = (e) => {
    e.preventDefault();
    var mp4File;
    for (let f of e.dataTransfer.files) {
        // TODO improve this (isvideo or issrt)
        if (isFile(f)) {
            console.log('File(s) you dragged here: ', f.path);
            mp4File = f;
        }
    }

    // TODO check if chromecast-client is ready before start it...
    chromecastClient.start(mp4File, function() {
        dropZone.style.display = 'none';
        videoControls.style.display = 'table-cell';
    });

    return false;
};

var isFile = function(file) {
    return fs.existsSync(file.path) && fs.statSync(file.path).isFile();
};

// video player events
var playButton = document.getElementById("play-button");
var pauseButton = document.getElementById("pause-button");
var stopButton = document.getElementById("stop-button");

playButton.addEventListener("click", function(event) {
    event.preventDefault();
    pauseButton.style.display = 'initial';
    playButton.style.display = 'none';
    chromecastClient.unpause();
}, false);

pauseButton.addEventListener("click", function(event) {
    event.preventDefault();
    pauseButton.style.display = 'none';
    playButton.style.display = 'initial';
    chromecastClient.pause();
}, false);

stopButton.addEventListener("click", function(event) {
    event.preventDefault();
    pauseButton.style.display = 'none';
    playButton.style.display = 'initial';
    chromecastClient.stop();
}, false);
