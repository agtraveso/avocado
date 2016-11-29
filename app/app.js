import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import VideoPlayer from './components/VideoPlayer';
import SplashView from './components/SplashView/SplashView';

const scanner = require('./lib/chromecast-scanner')();
const chromecastClient = require('./lib/chromecast-client')();

class App extends React.Component {

  constructor() {
    super();

    this.statusIntervalId;
    this.state = {
      connectedToChromecast: false,
      castingVideo: false,
      videoDuration: 0,
      videoCurrentTime: 0,
      media: null
    }
  }

  componentWillMount() {
    let self = this;
    // start scanning for chromecasts
    scanner.scan();
    scanner.on('found', function(host) {
      console.log('chromecast found: ' + host);
      chromecastClient.connect(host, function() {
        self.setState({connectedToChromecast: true});
      });

      // TODO this should be temporary
      scanner.stop();
    });
  }

  _onDrop(acceptedFiles, rejectedFiles) {
    let self = this;

    let media = {};
    for (let file of acceptedFiles) {
      console.log('File(s) you dragged here: ', file.path);
      if (file.path.substr(-4).toLowerCase() === '.srt') {
        media.subtitles = file;
      } else {
        // TODO check if it's a valid video format
        media.video = file;
      }
    };

    if (media) {
      chromecastClient.start(media, function(status) {
        self.setState({castingVideo: true, videoDuration: status.media.duration});
        self.statusIntervalId = setInterval(() => {
          chromecastClient.getStatus(function(err, status) {
            if (err) {
              console.err(err);
            }
            self.setState({videoCurrentTime: status.currentTime});
          });
        }, 1000);
      });

      this.setState({media: media});
    }
  }

  _onResume() {
    chromecastClient.unpause();
  }

  _onPause() {
    chromecastClient.pause();
  }

  _onStop() {
    chromecastClient.stop();
    this.setState({castingVideo: false});
    window.clearInterval(this.statusIntervalId);
  }

  _onSeek(newCurrentTime){
    chromecastClient.seek(newCurrentTime);
  }

  render() {
    let appRender = <div>looking for chromecasts...</div>;

    if (this.state.connectedToChromecast) {
      if (!this.state.castingVideo) {
        appRender = (
          <Dropzone onDrop={this._onDrop.bind(this)} className="drop-zone">
            <div>Just drop some files here, or click to select files to cast.</div>
          </Dropzone>
        );
      } else {
        appRender = (
          <VideoPlayer
            playing={true}
            media={this.state.media}
            onPause={this._onPause.bind(this)}
            onResume={this._onResume.bind(this)}
            onStop={this._onStop.bind(this)}
            onSeek={this._onSeek.bind(this)}
            videoDuration={this.state.videoDuration}
            videoCurrentTime={this.state.videoCurrentTime}
          />
        );
      }
    } else {
      appRender = <SplashView />;
    }

    return (appRender);
  }
}

// Render to ID app in the DOM
ReactDOM.render(< App / >, document.getElementById('app'));
