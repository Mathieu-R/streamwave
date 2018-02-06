import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Toast from './toast';

import Auth from '../routes/auth';
import Register from '../routes/auth/register';
import Login from '../routes/auth/login'
import Forgot from '../routes/auth/forgot';
import Reset from '../routes/auth/reset';

class App extends Component {
	render () {
		return (
			<div class="app">
				<Router>
          <Auth path="/auth" />
          <Register path="/auth/register" />
          <Login path="/auth/login" />
          <Reset path="/auth/reset/:token" />
          <Forgot path="/auth/forgot" />
				</Router>
        <Toast />
			</div>
		);
	}
}

export default App;
