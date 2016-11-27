import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import VideoPlayer from './components/VideoPlayer'
import SplashView from './components/SplashView/SplashView'

const scanner = require('./lib/chromecast-scanner')();
const chromecastClient = require('./lib/chromecast-client')();

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      connectedToChromecast: false,
      castingVideo: false
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
      chromecastClient.start(media, function() {
        self.setState({castingVideo: true});
      });
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
  }

  render() {
    let appRender;

    if (this.state.connectedToChromecast) {
      if (!this.state.castingVideo) {
        appRender = (
          <Dropzone onDrop={this._onDrop.bind(this)} className="drop-zone">
            <div>Just drop some files here, or click to select files to cast.</div>
          </Dropzone>
        );
      } else {
        appRender = (
          <VideoPlayer playing={true} onPause={this._onPause.bind(this)} onResume={this._onResume.bind(this)} onStop={this._onStop.bind(this)}/>
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
