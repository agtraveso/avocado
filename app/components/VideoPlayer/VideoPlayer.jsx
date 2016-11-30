import React from 'react'
import ProgressVideoBar from './ProgressVideoBar/ProgressVideoBar'
import VolumeSlider from 'rc-slider'

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: this.props.playing
    }
  }

	componentDidMount() {}

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

  _handleVolumeChange(volumeValue) {
    this.props.onVolumeChange(volumeValue);
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
			<div className="video-player-container">
				<div className="video-controls">
					<div className="inner-video-controls">
						{currentPlayerButtons}
					</div>
				</div>
				<ProgressVideoBar
					onSeek={this.props.onSeek}
					duration={this.props.videoDuration}
					currentTime={this.props.videoCurrentTime} />

				<div className="volume">
          <span className="label">Volume</span>
		      <VolumeSlider min={0} max={1} defaultValue={0.5} step={0.2}
          tipFormatter={null}
          onAfterChange={this._handleVolumeChange.bind(this)}/>
		    </div>
			</div>
		);
	}
}

export default VideoPlayer
