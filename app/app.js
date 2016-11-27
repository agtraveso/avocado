import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import VideoPlayer from './components/VideoPlayer'

const scanner = require('./lib/chromecast-scanner')();
const chromecastClient = require('./lib/chromecast-client')();

class App extends React.Component {

	constructor() {
		super();

		this.state = {
			connectedToChromecast: false,
			castingVideo: false,
			videoDuration: 0,
			videoCurrentTime: 0
		}
	}

	componentWillMount() {
		let self = this;
		// start scanning for chromecasts
		scanner.scan();
		scanner.on('found', function(host) {
			console.log('chromecast found: ' + host);
			chromecastClient.connect(host);
			self.setState({connectedToChromecast: true});

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
				// TODO clear somewhere this interval
				setInterval(() => {
					chromecastClient.getStatus(function(status) {
						self.setState({videoCurrentTime: status.currentTime});
					});
				}, 1000);
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
		let appRender = <div>looking for chromecasts...</div>;
		if (this.state.connectedToChromecast && !this.state.castingVideo) {
			appRender = (
				<Dropzone onDrop={this._onDrop.bind(this)} className="drop-zone">
					<div>Just drop some files here, or click to select files to cast.</div>
				</Dropzone>
			);
		} else if (this.state.connectedToChromecast && this.state.castingVideo) {
			appRender = (
        <VideoPlayer
					playing={true}
					onPause={this._onPause.bind(this)}
					onResume={this._onResume.bind(this)}
					onStop={this._onStop.bind(this)}
					videoDuration={this.state.videoDuration}
					videoCurrentTime={this.state.videoCurrentTime}
				/>
      );
		}

		return (appRender);
	}
}

// Render to ID app in the DOM
ReactDOM.render(< App / >, document.getElementById('app'));
