const http = require('http');
var fs = require('fs');
var internalIp = require('internal-ip');
var rangeParser = require('range-parser');
var mime = require('mime');
const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

const LocalServer = function() {
    if (!(this instanceof LocalServer))
        return new LocalServer();
    EventEmitter.call(this);
};

inherits(LocalServer, EventEmitter);

LocalServer.prototype.serve = function(mp4File, callback) {
    var self = this;
    self.ip = internalIp();
    self.port = 3100;
    self.server = http.createServer(function(request, response) {
        if (request.method === 'GET' && request.url === '/test') {
            console.log('serving video...');
            serveMp4(request, response, mp4File.path);
        } else {
            response.statusCode = 404;
            response.end();
        }
    }).listen(self.port);
    console.log('Started webserver on http://%s:%s', self.ip, self.port);

    self.urlFileServing = 'http://' + self.ip + ':' + self.port + '/test';
    self.emit('ready', self.urlFileServing);

    callback(null, self.urlFileServing);
};

LocalServer.prototype.shutdown = function(callback) {
    var self = this;
    this.server.close(callback);
};

module.exports = LocalServer

var serveMp4 = function(req, res, filePath) {
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
