import { h, Component } from 'preact';
import styled, { keyframes } from 'styled-components';
import shaka from 'shaka-player';
import ProgressBar from './progress-bar-presentation';
import { formatDuration, getRGBCssFromObject } from '../utils';
import Constants from '../constants';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.background};
  overflow: hidden;
`;

const fade = keyframes`
  from: {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Play = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50px;
  width: 50px;
  opacity: 0;
  animation: ${fade} linear 0.3s;
`;

const CoverContainer = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 60px;
`;

const Cover = styled.div``;

const Artwork = styled.img`
  max-width: 300px;
`;

const Footer = styled.section`
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100px;
`;

const ProgressWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5px;
  width: 100%;
`;

const AllInfos = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const CurrentTime = styled.span`
  margin: 0 20px;
  font-weight: bold;
`;

const TotalTime = styled.div`
  margin: 0 20px;
  font-weight: bold;
`;

const Infos = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  height: 100px;
`;

const Title = styled.span`
  margin: 3px;
  font-size: 18px;
`;

const Artist = styled.span`
  font-size: 14px;
  font-weight: 400;
  margin: 3px;
  opacity: 0.7;
`;

const Album = styled.span`
  font-size: 14px;
  font-weight: 400;
  margin: 3px;
  opacity: 0.7;
`;

class Presentation extends Component {
  constructor () {
    super();

    this.audio = null;
    this.player = null;

    this.updateTime = this.updateTime.bind(this);

    this.state = {
      coverURL: 'ability/ability.jpg',
      artist: 'Borrtex',
      album: 'Ability',
      title: 'Ability',
      duration: 353,
      playing: true,
      currentTime: 7.82,
      totalTime: 153,
      primaryColor: {r:117, g:118, b:119},
      manifestURL: 'ability/01-1451113-Borrtex-Ability/manifest-full.mpd'
    }
  }

  componentDidMount () {
    if (!navigator.presentation.receiver) {
      console.warn('Presentation page not opened through Presentation API !');
      return;
    }

    this.initShakaPlayer();

    navigator.presentation.receiver.connectionList
    .then(list => {
      console.log(list);
      // the spec says to do that
      list.connections.map(connection => this.addConnection(connection));
      list.onconnectionavailable = evt => this.addConnection(evt.connection);
    })
    .catch(err => console.error(err));
  }

  initShakaPlayer () {
    // install shaka player polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...');
      return;
    }

    this.player = new shaka.Player(this.audio);

    // listen to errors
    this.player.addEventListener('error', err => console.error(err));
  }

  /**
   * Stream an audio with DASH (thanks to shaka-player)
   * @param {String} manifest manifest url
   */
  listen (manifest) {
    return this.player.load(`${Constants.CDN_URL}/${manifest}`).then(_ => {
      console.log(`[shaka-player] Music loaded: ${manifest}`);
      return this.audio.play();
    }).catch(err => {
      console.error(err);
    });
  }

  addConnection (connection) {
    // listen for messages event
    // we give all the informations about media by there
    // no redux store here
    connection.onmessage = async evt => {
      const data = JSON.parse(evt.data);
      const {type} = data;

      if (type === 'song') {
        this.setState(data);
        this.listen(data.manifestURL);
        return;
      }

      if (type === 'seek') {
        this.audio.currentTime = data.currentTime;
        return;
      }

      if (type === 'volume') {
        this.audio.volume = data.volume;
        return;
      }
    }
  }

  updateTime (evt) {
    const {duration, currentTime} = this.audio;
    // onTimeUpdate fires up even when no audio is played.
    if (!duration) return;

    this.setState({currentTime});
  }

  render ({}, {
    coverURL, title, artist, album, duration,
    playing, currentTime, totalTime, primaryColor
  }) {
    return (
      <Container>
        <CoverContainer background={primaryColor}>
          <Cover>
            <Artwork src={coverURL && `${Constants.CDN_URL}/${coverURL}`} alt="cover artwork" />
          </Cover>
        </CoverContainer>
          <Footer>
            <ProgressWrapper>
              <ProgressBar duration={duration} currentTime={currentTime} />
            </ProgressWrapper>
            <AllInfos>
              <CurrentTime>{formatDuration(currentTime)}</CurrentTime>
              <Infos>
                <Title>{title}</Title>
                <Artist>{artist}</Artist>
                <Album>{album}</Album>
              </Infos>
              <TotalTime>{formatDuration(totalTime)}</TotalTime>
            </AllInfos>
          </Footer>
        <Play aria-label="play or pause track">
          {
            playing ?
            <svg fill="#FFFFFF" height="45" width="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2
                  12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"
              />
            </svg>
            :
            <svg fill="#FFFFFF" height="45" width="45" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path
                d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48
                  10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
            </svg>
          }
          </Play>
        <audio preload="metadata" ref={audio => this.audio = audio} onTimeUpdate={this.updateTime}></audio>
      </Container>
    );
  }
}

export default Presentation;

