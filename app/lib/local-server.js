const http = require('http');
var fs = require('fs');
var internalIp = require('internal-ip');
var rangeParser = require('range-parser');
var mime = require('mime');
var srt2vtt = require('srt2vtt');
const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

const LocalServer = function () {
	if (!(this instanceof LocalServer)) return new LocalServer();
	var self = this;
	self.ip = self.ip || internalIp();
	self.port = 3100;
	self.port_subs = 3101;
	self.video_route = '/video';

	self.ctx = {
		videoUrl: 'http://' + self.ip + ':' + self.port + self.video_route,
		subtitlesUrl: 'http://' + self.ip + ':' + self.port_subs
	};

	EventEmitter.call(self);
};

inherits(LocalServer, EventEmitter);

LocalServer.prototype.serve = function (media, callback) {
	var self = this;
	// check for subtitles first
	if (media.subtitles) {
		self.serveSubtitles(media.subtitles, function (err, ctx) {
			if (err && callback) return callback(err);
			// let's serve the video now
			if (media.video) {
				self.serveVideo(media.video, callback);
			}
		});
	} else if (media.video) {
		self.serveVideo(media.video, callback);
	}
};

LocalServer.prototype.serveVideo = function (videoFile, callback) {
	var self = this;
	self.server = http.createServer(function (request, response) {
		if (request.method === 'GET' && request.url === self.video_route) {
			console.log('[GET] ' + request.url);
			serveMp4(request, response, videoFile.path);
		} else {
			response.statusCode = 404;
			response.end();
		}
	}).listen(self.port);
	console.log('Started video-server on http://%s:%s', self.ip, self.port);

	self.emit('ready', self.ctx);
	callback(null, self.ctx);
};

LocalServer.prototype.serveSubtitles = function (subtitles, callback) {
	var self = this;

	srtToVtt(subtitles, function (err, vttData) {
		self.server_subs = http.createServer(function (request, response) {
			response.writeHead(200, {
				'Access-Control-Allow-Origin': '*',
				'Content-Length': vttData.length,
				'Content-type': 'text/vtt;charset=utf-8'
			});
			response.end(vttData);
		}).listen(self.port_subs);
		console.log('Started subtitles-server on http://%s:%s', self.ip, self.port_subs);

		callback(null, self.ctx);
	});
};

LocalServer.prototype.shutdown = function (callback) {
	if (this.server_subs) {
		this.server_subs.close();
	}
	this.server.close(callback);
};

module.exports = LocalServer

var srtToVtt = function (subtitles, callback) {
	var srtData = fs.readFileSync(subtitles.path);
	srt2vtt(srtData, function (err, vttData) {
		if (err)
			return callback(err);
		console.log('converted srt to vtt: %s', subtitles.path);
		callback(null, vttData);
	});
};

var serveMp4 = function (req, res, filePath) {
	var stat = fs.statSync(filePath);
	var total = stat.size;
	var range = req.headers.range;
	var type = mime.lookup(filePath);

	res.setHeader('Content-Type', type);
	res.setHeader('Access-Control-Allow-Origin', '*');

	if (!range) {
		res.setHeader('Content-Length', total);
		res.statusCode = 200;
		return fs.createReadStream(filePath).pipe(res);
	}

	var part = rangeParser(total, range)[0];
	var chunksize = (part.end - part.start) + 1;
	var file = fs.createReadStream(filePath, {
		start: part.start,
		end: part.end
	});

	res.setHeader('Content-Range', 'bytes ' + part.start + '-' + part.end + '/' + total);
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Length', chunksize);
	res.statusCode = 206;

	return file.pipe(res);
};
