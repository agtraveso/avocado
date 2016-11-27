import React from 'react';

class ProgressVideoBar extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
    let percent = ((100 * this.props.currentTime) / this.props.duration).toFixed(2);

		let style = {
			width: percent + '%'
		};

		return (
			<div className="progress-bar-container">
				<div className="progress-bar">
					<span style={style}></span>
				</div>
			</div>
		);
	}
}

export default ProgressVideoBar
