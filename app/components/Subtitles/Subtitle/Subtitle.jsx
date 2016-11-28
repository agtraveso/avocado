import React from 'react';

class Subtitle extends React.Component {

  _handleSubtitleSelected(lang) {
    this.props.onSubtitleSelected(lang);
  }

  render() {
    return (
        <div className="subtitle">
          <button onClick={this._handleSubtitleSelected.bind(this, this.props.lang)} lang={this.props.lang}>{this.props.name}</button>
        </div>
    );
  }
}

export default Subtitle
