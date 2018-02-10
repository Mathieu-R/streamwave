// https://tylermcginnis.com/react-router-protected-routes-authentication/
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'unistore/preact';
import authenticated from './authenticated';

// has the same api as <Route />
@connect([], {storeUser: 'storeUser'})
class Private {
  render ({component: Component, storeUser, ...props}) {
    // renders a route and pass all the props
    <Route {...props} render={(props => {
      // check if the user is authenticated
      // then return the Component or perform a redirection
      authenticated(storeUser) ? <Component {...props} /> : <Redirect to="/auth" />
    })} />
  }
}
