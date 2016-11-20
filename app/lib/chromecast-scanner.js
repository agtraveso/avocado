const mdns = require('mdns');
const inherits = require('util').inherits;
const EventEmitter = require('events').EventEmitter;

const Scanner = function() {
    if (!(this instanceof Scanner))
        return new Scanner();
    EventEmitter.call(this);

    var self = this;
    self.browser = mdns.createBrowser(mdns.tcp('googlecast'));
    self.browser.on('serviceUp', function(service) {
        console.log('found chromecast: "%s" at %s:%d', service.name, service.addresses[0], service.port);
        self.emit('found', service.addresses[0]);
    });
};

inherits(Scanner, EventEmitter);

Scanner.prototype.scan = function() {
    console.log('looking for chromecasts...');
    this.browser.start();
};

Scanner.prototype.stop = function() {
    this.browser.stop();
    console.log('stopped');
};

module.exports = Scanner;
