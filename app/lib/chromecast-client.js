const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const LocalServer = require('./local-server');

const ChromecastClient = function () {
	if (!(this instanceof ChromecastClient))
		return new ChromecastClient();
	var self = this;

	self.client = new Client();
	self.client.on('error', function (err) {
		console.log('Error: %s', err.message);
		self.client.close();
	});
};

// establish a connection to a chromecast device
ChromecastClient.prototype.connect = function (host) {
	var self = this;

	self.client.connect(host, function () {
		console.log('connected to chromecast at %s', host);
		// launch it now
		self.client.launch(DefaultMediaReceiver, function (err, player) {
			console.log('app "%s" launched...', player.session.displayName);
			self.player = player;
			self.player.on('status', function (status) {
				console.log('player state: %s', status.playerState);
			});
		});
	});
};

ChromecastClient.prototype.start = function (media, callback) {
	var self = this;
	// TODO handle other input type files: now only works with files

	// serve media on localServer
	if (!self.server) self.server = new LocalServer();
	self.server.serve(media, function (err, ctx) {
		if (err && callback) return callback(err);
		self.player.load(self.getMedia(ctx), {
			autoplay: true,
			activeTrackIds: [1]
		}, function (err, status) {
			if (err && callback) return callback(err);
			callback();
		});
	});
};

ChromecastClient.prototype.pause = function (callback) {
	this.player.pause(callback);
};

ChromecastClient.prototype.unpause = function (callback) {
	this.player.play(callback);
};

ChromecastClient.prototype.stop = function (callback) {
	this.player.stop(callback);
};

ChromecastClient.prototype.getStatus = function (callback) {
	this.player.getStatus(function (err, status) {
		if (err && callback) return callback(err);
		callback(status);
	});
};

ChromecastClient.prototype.seek = function (newCurrentTime, callback) {
	this.player.seek(newCurrentTime, callback);
};

ChromecastClient.prototype.getMedia = function (ctx) {
	return {
		// Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
		contentId: ctx.videoUrl,
		contentType: 'video/mp4',
		streamType: 'BUFFERED',
		textTrackStyle: {
			backgroundColor: '#00000000',
			foregroundColor: '#FFFFFFFF',
			edgeColor: '#00000000',
			edgeType: 'OUTLINE', // can be: "NONE", "OUTLINE", "DROP_SHADOW", "RAISED", "DEPRESSED"
			fontScale: 1.5, // transforms into "font-size: " + (fontScale*100) +"%"
			fontStyle: 'NORMAL', // can be: "NORMAL", "BOLD", "BOLD_ITALIC", "ITALIC",
			fontFamily: 'Droid Sans', // specific font family
			fontGenericFamily: 'SANS_SERIF', // can be: "SANS_SERIF", "MONOSPACED_SANS_SERIF", "SERIF", "MONOSPACED_SERIF", "CASUAL", "CURSIVE", "SMALL_CAPITALS",
			windowRoundedCornerRadius: 10, // radius in px
			windowType: 'NONE' // can be: "NONE", "NORMAL", "ROUNDED_CORNERS"
		},
		tracks: [{
			trackId: 1, // This is an unique ID, used to reference the track
			type: 'TEXT', // Default Media Receiver currently only supports TEXT
			trackContentId: ctx.subtitlesUrl, // the URL of the VTT
			trackContentType: 'text/vtt', // Currently only VTT is supported
			name: 'English', // a Name for humans
			language: 'en-US', // the language
			subtype: 'SUBTITLES' // should be SUBTITLES
		}]
	};
};

module.exports = ChromecastClient
