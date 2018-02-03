import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Toast from './toast';

import Auth from 'async!../routes/auth';
import Register from 'async!../routes/auth/register';
import Login from 'async!../routes/auth/login'
import Forgot from 'async!../routes/auth/forgot';
import Reset from 'async!../routes/auth/reset';

class App extends Component {

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render({user, toast, toasting, register, login, getResetToken, changePassword}) {
		return (
			<div class="app">
				<Router>
          <Auth path="/auth" />
          <Register path="/auth/register" toasting={toasting} />
          <Login path="/auth/login" toasting={toasting} />
          <Reset path="/auth/reset/:token" toasting={toasting} />
          <Register path="/auth/forgot" toasting={toasting} />
				</Router>
        <Toast toast={toast} />
			</div>
		);
	}
}

export default App;
