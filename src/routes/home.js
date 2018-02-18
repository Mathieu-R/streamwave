import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';

import Player from '../components/player';
import NavBar from '../components/navbar';

import Library from './library';
import Album from './album';


class Home extends Component {
  render () {
    return (
      <div class="home">
        <Switch>
          <Route exact path="/" component={Library} />
          <Route path="/album/:id" component={Album} player={this.player}/>
        </Switch>
        <NavBar />
        <Player ref={player => this.player = player} />
      </div>
    );
  }
}

export default Home;
