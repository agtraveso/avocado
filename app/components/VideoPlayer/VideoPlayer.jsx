import React from 'react'
import ProgressVideoBar from './ProgressVideoBar/ProgressVideoBar'
import VolumeSlider from 'rc-slider'

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    // keep a reference to this function. reason why this is required: https://gist.github.com/Restuta/e400a555ba24daa396cc
    this._boundHandleKeyEvents = this._handleKeyEvents.bind(this);
    this.state = {
      playing: this.props.playing
    }
  }

	componentDidMount() {
    this._registerKeyEvents();
  }

  componentWillUnmount() {
    this._unregisterKeyEvents();
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

  _handleVolumeChange(volumeValue) {
    this.props.onVolumeChange(volumeValue);
  }

  _addCommonButtons(playerButtons) {
    let stopButton = <button className="stop" onClick={this._handleStop.bind(this)} key="stopButton">stop</button>;
    playerButtons.push(stopButton);
  }

  _togglePlaying(){
    if (this.state.playing) {
      this._handlePause();
    } else {
      this._handleResume();
    }
  }

  _registerKeyEvents(){
    // using window till a better solution pops up: https://github.com/facebook/react/issues/285
    window.addEventListener('keydown', this._boundHandleKeyEvents);
  }

  _unregisterKeyEvents(){
    window.removeEventListener('keydown', this._boundHandleKeyEvents);
  }

  _handleKeyEvents(e){
    switch (e.code) {
      case "ArrowDown":
      // TODO volume down
      break;
      case "ArrowUp":
      // TODO volume up
      break;
      case "ArrowLeft":
      // TODO rewind
      break;
      case "ArrowRight":
      // TODO fast-forward
      break;
      case "Escape":
      this._handleStop();
      break;
      case "Space":
      this._togglePlaying();
      break;
      default:
      return;
    }
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
        <div className="volume">
          <span className="label">Volume</span>
		      <VolumeSlider
            min={0} max={1} defaultValue={1} step={0.2}
            tipFormatter={null}
            onAfterChange={this._handleVolumeChange.bind(this)}/>
		    </div>
				<ProgressVideoBar
					onSeek={this.props.onSeek}
					duration={this.props.videoDuration}
					currentTime={this.props.videoCurrentTime} />
			</div>
		);
	}
}

export default VideoPlayer
