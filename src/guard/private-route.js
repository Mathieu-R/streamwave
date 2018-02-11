// https://tylermcginnis.com/react-router-protected-routes-authentication/
import { Component } from 'preact';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'unistore/preact';
import authenticated from './authenticated';

//has the same api as <Route />
@connect([], {storeUser: 'storeUser'})
class Private extends Component {
  render ({component: Component, storeUser, ...props}) {
    // renders a route and pass all the props
    <Route {...props} render={(props => {
      // check if the user is authenticated
      // then return the Component or perform a redirection
      authenticated(storeUser) ? <Component {...props} /> : <Redirect to="/auth" />
    })} />
  }
}

// const Private = ({component: Component, ...props}) => (
//   <Route {...props} render={(props => {
//     authenticated() ? <Component {...props} /> : <Redirect to="/auth" />
//   })} />
// )

export default Private;
