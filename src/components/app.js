import { h, Component } from 'preact';
import { Router } from 'preact-router';

export default class App extends Component {
	
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Login path="/login"/>
				</Router>
			</div>
		);
	}
}
