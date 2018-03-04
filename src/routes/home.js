import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';

import MiniPlayer from '../components/mini-player';
import PlayerCP from '../components/player';
import NavBar from '../components/navbar';

import Library from './library';
import Album from './album';

import Player from '../player';


class Home extends Component {
  constructor () {
    super();

    this.onPrevClick = this.onPrevClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.onChromecastClick = this.onChromecastClick.bind(this);
  }

  componentDidMount () {
    // wait for audio element to be available
    this.player = new Player();
  }

  onPrevClick (evt) {

  }

  onNextClick (evt) {

  }

  onPlayClick (evt) {

  }

  onChromecastClick (evt) {
    this.player.remote();
  }

  render () {
    return (
      <div class="home">
        <Switch>
          <Route exact path="/" component={Library} />
          <Route exact path="/album/:id" component={Album} player={this.player} />
        </Switch>
        <MiniPlayer
          onPrevClick={this.onPrevClick}
          onNextClick={this.onNextClick}
          onPlayClick={this.onPlayClick}
          onChromecastClick={this.onChromecastClick}
        />
        <NavBar />
        {/*<PlayerCP ref={player => this.player = player} />*/}
        <audio
          ref={audio => this.audioElement = audio}
          preload="metadata"
        >
        </audio>
      </div>
    );
  }
}

export default Home;
