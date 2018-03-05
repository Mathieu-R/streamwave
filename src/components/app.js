import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import PrivateRoute from '../guard/private-route';

import Toast from './toast';

import Home from '../routes/home';
import Auth from '../routes/auth';

class App extends Component {
	render () {
    const theme = {
      mobile: '530px',
      background: '#161C36',
      miniPlayer: {
        height: '45px',
        background: '#212121',
      },
      navbar: {
        height: '55px',
        background: '#222223'
      }
    }

		return (
      <ThemeProvider theme={theme}>
        <div class="app">
          <Switch>
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
          <Toast />
        </div>
      </ThemeProvider>
		);
	}
}

export default App;
