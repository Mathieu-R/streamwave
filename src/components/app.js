import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Loadable from 'react-loadable';
import Loading from './loading';
import styled from 'styled-components';
import PrivateRoute from '../guard/private-route';

import Toast from './toast';
import Auth from '../routes/auth';

const Home = Loadable({
  loader: () => import('../routes/home' /* webpackPrefetch: true, webpackChunkName: "route-home" */),
  loading: Loading,
  timeout: 10000
});

const Presentation = Loadable({
  loader: () => import('./presentation' /* webpackChunkName: "route-presentation" */),
  loading: Loading,
  timeout: 10000
});

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

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
  // spotify inspired background
  background: 'linear-gradient(#485460, #0b0c0d 85%)', //'#161C36',
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

const App = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <Switch>
        <Route path="/auth" component={Auth} />
        {/* Trying some stuff with chromecast */}
        <Route exact path="/presentation" component={Presentation} />
        <PrivateRoute path="/" component={Home} />
      </Switch>
      <Toast />
    </Container>
  </ThemeProvider>
);

export default App;
