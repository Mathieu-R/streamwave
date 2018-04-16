import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Player from './player';
import styled from 'styled-components';
import PrivateRoute from '../guard/private-route';

import Toast from './toast';

import Home from '../routes/home';
import Auth from '../routes/auth';

const Container = styled.div`
  min-height: 100vh;
  background: #161C36;
`;

class App extends Component {
	render () {
    const theme = {
      auth: {
        background: '#7C7C7C',
        google: {
          background: '#2962FF'
        },
        logout: {
          background: '#1870D7'
        }
      },
      background: '#161C36',
      menu: {
        active: '#4A90E2'
      },
      miniPlayer: {
        height: '45px',
        background: '#212121',
      },
      mobile: '530px',
      navbar: {
        height: '55px',
        background: '#222223'
      },
      primaryColor: '#4A90E2',
      slider: {
        background: '#979797',
        progress: {
          color: '#4A90E2'
        },
        round: {
          background: '#1870D7'
        },
        player: {
          background: '#D8D8D8',
          progress: {
            background: '#FFF',
          },
          round: {
            background: '#FFF'
          }
        }
      },
      switch: {
        opacity: 0.3,
        round: '#4A90E2'
      },
      track: {
        active: '#4A90E2'
      },
      welcome: {
        subtitle: {
          color: '#D8D8D8'
        }
      }
    };

		return (
      <ThemeProvider theme={theme}>
        <Container>
          <Switch>
            <Route path="/auth" component={Auth} />
            {/* Trying some stuff with chromecast, should try to protect this route later */}
            <Route exact path="/chromecast"
              render={
                props =>
                <Player
                  //onPlayClick={this.onPlayClick}
                />
              }
            />
            <PrivateRoute path="/" component={Home} />
          </Switch>
          <Toast />
        </Container>
      </ThemeProvider>
		);
	}
}

export default App;
