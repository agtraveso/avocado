import React from 'react';
import Subtitle from './Subtitle/Subtitle'
import OpenSubtitles from 'opensubtitles-api'

class Subtitles extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subtitles: null
    };
  }

  _handleDownloadSubtitles() {
    console.log('download subtitles');

    var openSubs = new OpenSubtitles('OSTestUserAgentTemp');

    console.log(this.props.mediaName);

    var subs = openSubs.search({
      filename: this.props.mediaName
      // sublanguageid: 'eng'
    }).then(subtitles => {
      console.log(subtitles);
      this.setState({subtitles: subtitles});
    }).catch(error => {
      console.error(error);
    });
  }

  _handleSubtitleSelected(lang) {
    let subtitleUrl = this.state.subtitles[lang].url;

    console.log("Setting subtitle for lang " + lang);
    console.log("Using url: " + subtitleUrl);

    this.props.onSubtitleSelected(this.state.subtitles[lang].url);
  }

  _getSubtitles() {
    if (this.state.subtitles) {
      let subtitles = this.state.subtitles;
      return Object.keys(subtitles).map(lang => {
        // TODO using object key
        let subtitle = subtitles[lang];
        return(
          <Subtitle name={subtitle.langName} lang={subtitle.lang} key={subtitle.id} onSubtitleSelected={this._handleSubtitleSelected.bind(this)}/>
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="subtitles_container">
        <div className="action">
          <button className="subtitles" onClick={this._handleDownloadSubtitles.bind(this)} key="downloadSubtitlesButton">download subtitles</button>
        </div>

        <div className="subtitles">
          {this._getSubtitles()}
        </div>
      </div>
    );
  }
}

export default Subtitles
