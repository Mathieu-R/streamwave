import { h, Component } from 'preact';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Private } from '../guard/private-route';

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
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/auth/register" component={Register} />
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/reset/:token" component={Reset} />
            <Route path="/auth/forgot" component={Forgot} />
          </Switch>
				</Router>
        <Toast />
			</div>
		);
	}
}

export default App;
