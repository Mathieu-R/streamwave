import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Auth from 'async!../routes/auth';

class App extends Component {

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Auth path="/auth" />
				</Router>
			</div>
		);
	}
}

export default App;
