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
          <Route exact path="/" component={Library} />
          <Route exact path="/album/:id" component={Album} />
          <Route exact path="/auth" component={Auth} />
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/reset/:token" component={Reset} />
          <Route path="/auth/forgot" component={Forgot} />
        </Switch>
        <Toast />
			</div>
		);
	}
}

export default App;
