import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import Private from '../guard/private-route';

import Toast from './toast';

import Auth from '../routes/auth';
import Register from '../routes/auth/register';
import Login from '../routes/auth/login'
import Forgot from '../routes/auth/forgot';
import Reset from '../routes/auth/reset';

import Library from 'async!../routes/library';

class App extends Component {
	render () {
		return (
			<div class="app">
        <Switch>
          <Route path="/" component={Library} />
          <Route path="/auth" component={Auth} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/reset/:token" component={Reset} />
          <Route path="/forgot" component={Forgot} />
        </Switch>
        <Toast />
			</div>
		);
	}
}

export default App;
