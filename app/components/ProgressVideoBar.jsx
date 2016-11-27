import React from 'react';

class ProgressVideoBar extends React.Component {
	constructor(props) {
		super(props);

	}

	_handleShowCurrentTime(event){
		event.preventDefault();
		let time = this._getRelativeTime(event);
	}

	_handleSeek(event){
		event.preventDefault();
		let newCurrentTime = this._getRelativeTime(event);
		this.props.onSeek(newCurrentTime);
	}

	_getRelativeTime(event){
		let progressBarWidth = event.target.offsetWidth;
		let relativePos = event.pageX - event.target.getBoundingClientRect().left;
		let relativePercent = ((100 * relativePos) / progressBarWidth).toFixed(2);

		let time = (this.props.duration * relativePercent) / 100;
		return time;
	}

	render() {
    let percent = ((100 * this.props.currentTime) / this.props.duration).toFixed(2);

		let style = {
			width: percent + '%'
		};

		return (
			<div className="progress-bar-container"
				onMouseOver={this._handleShowCurrentTime.bind(this)}
				onClick={this._handleSeek.bind(this)}
				>
				<div className="progress-bar">
					<span style={style}></span>
				</div>
			</div>
		);
	}
}

export default ProgressVideoBar
