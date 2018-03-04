import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Home from './home';
import Register from './register';
import Login from './login'
import Forgot from './forgot';
import Reset from './reset';

const Container = styled.div`
  display: block;
`;

const Auth = (props) => (
  <Container>
    <Switch>
      <Route exact path="/auth" component={Home} />
      <Route exact path="/auth/register" component={Register} />
      <Route exact path="/auth/login" component={Login} />
      <Route exact path="/auth/reset/:token" component={Reset} />
      <Route exact path="/auth/forgot" component={Forgot} />
    </Switch>
  </Container>
);

export default Auth;
