import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import Private from '../guard/private-route';

import Toast from './toast';

import Home from '../routes/home';
import Auth from '../routes/auth';

class App extends Component {
	render () {
		return (
			<div class="app">
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/" component={Home} />
        </Switch>
        <Toast />
			</div>
		);
	}
}

export default App;
