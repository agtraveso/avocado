import React from 'react';

class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			playing: this.props.playing
		}
	}

	_handleResume() {
		this.setState({playing: true});
		this.props.onResume();
	}

	_handlePause() {
		this.setState({playing: false});
		this.props.onPause();
	}

  _handleStop() {
    this.setState({playing: false});
		this.props.onStop();
  }

  _addCommonButtons(playerButtons) {
    let stopButton = <button className="stop" onClick={this._handleStop.bind(this)} key="stopButton">stop</button>;
    playerButtons.push(stopButton);
  }

	render() {
		let currentPlayerButtons;
		if (this.state.playing) {
			currentPlayerButtons = [
        <button className="pause" onClick={this._handlePause.bind(this)} key="pauseButton">pause</button>
      ];
		} else {
			currentPlayerButtons = [
        <button className="play" onClick={this._handleResume.bind(this)} key="playButton">play</button>
      ];
		}

    this._addCommonButtons(currentPlayerButtons);

		return (
			<div className="video-controls">
				<div className="inner-video-controls">
					{currentPlayerButtons}
				</div>
			</div>
		);
	}
}

export default VideoPlayer
