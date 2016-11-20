const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const LocalServer = require('./local-server');

const ChromecastClient = function() {
    if (!(this instanceof ChromecastClient))
        return new ChromecastClient();
    var self = this;

    self.client = new Client();
    self.client.on('error', function(err) {
        console.log('Error: %s', err.message);
        self.client.close();
    });
};

// establish a connection to a chromecast device
ChromecastClient.prototype.connect = function(host) {
    var self = this;

    self.client.connect(host, function() {
        console.log('connected to chromecast at %s', host);
        // launch it now
        self.client.launch(DefaultMediaReceiver, function(err, player) {
            console.log('app "%s" launched...', player.session.displayName);
            self.player = player;
            self.player.on('status', function(status) {
                console.log('player state: %s', status.playerState);
            });
        });
    });
};

ChromecastClient.prototype.start = function(mp4File, callback) {
    var self = this;
    // TODO handle other input type files: now only works with files

    // serve mp4 on localServer
    // TODO support server restart
    self.server = new LocalServer();
    self.server.serve(mp4File, function(err, urlFileServing) {
        if (err && callback)
            return callback(err);
        self.media = {
            // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
            contentId: urlFileServing,
            contentType: 'video/mp4',
            streamType: 'BUFFERED'
        };
        console.log('loading media: %s ...', self.media.contentId);
        self.player.load(self.media, {
            autoplay: true
        }, function(err, status) {
            if (err && callback)
                return callback(err);
            callback();
        });
    });
};

ChromecastClient.prototype.pause = function(callback) {
    this.player.pause(callback);
};

ChromecastClient.prototype.unpause = function(callback) {
    this.player.play(callback);
};

ChromecastClient.prototype.stop = function(callback) {
    this.player.stop(callback);
};

ChromecastClient.prototype.getStatus = function(callback) {
    this.player.getStatus(function(err, status) {
        if (err && callback)
            return callback(err);
        callback(status);
    });
};

ChromecastClient.prototype.seek = function(newCurrentTime, callback) {
    this.player.seek(newCurrentTime, callback);
};

module.exports = ChromecastClient
