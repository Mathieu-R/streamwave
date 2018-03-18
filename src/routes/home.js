import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';

import MiniPlayer from '../components/mini-player';
import PlayerCP from '../components/player';
import NavBar from '../components/navbar';
import Audio from '../components/audio';

import Library from './library';
import Album from './album';

import Player from '../player';


class Home extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="home">
        <Switch>
          <Route exact path="/" component={Library} />
          <Route exact path="/album/:id" component={Album} audio={this.audio} />
        </Switch>
        <MiniPlayer audio={this.audio} />
        <NavBar />
        {/*<PlayerCP ref={player => this.player = player} />*/}
        <Audio
          ref={audio => this.audio = audio}
          preload="metadata"
        />
      </div>
    );
  }
}

export default Home;
