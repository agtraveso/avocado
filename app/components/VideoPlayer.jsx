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

	render() {
		let currentPlayerButtons;
		if (this.state.playing) {
			currentPlayerButtons = <button onClick={this._handlePause.bind(this)}>pause</button>;
		} else {
			currentPlayerButtons = <button onClick={this._handleResume.bind(this)}>play</button>;
		}

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
