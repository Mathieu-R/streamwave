import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';

import MiniPlayer from '../components/mini-player';
import Player from '../components/player';
import NavBar from '../components/navbar';

import Library from './library';
import Album from './album';


class Home extends Component {
  render () {
    return (
      <div class="home">
        <Switch>
          <Route path="/home" component={Library} />
          <Route path="/album/:id" component={Album} player={this.player}/>
        </Switch>
        <MiniPlayer
          onPrevClick={}
          onNextClick={}
          onPlayClick={}
          onChromecastClick={}
        />
        <NavBar />
        {/*<Player ref={player => this.player = player} />*/}
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
