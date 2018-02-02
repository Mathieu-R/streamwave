import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Auth from 'async!../routes/auth';
import Register from 'async!../routes/auth/register';
import Login from 'async!../routes/auth/login'
import Forgot from 'async!../routes/auth/forgot';
import Reset from 'async!../routes/auth/reset';

class App extends Component {

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div class="app">
				<Router onChange={this.handleRoute}>
          <Auth path="/auth" />
          <Register path="/auth/register" />
          <Login path="/auth/login" />
          <reset path="/auth/reset" />
				</Router>
			</div>
		);
	}
}

export default App;
