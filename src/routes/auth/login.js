import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Form, InputWrapper, Label, FormButton } from '../../components/ui';
import Constants from '../../constants';

import {
  toasting
} from '../../store/toast';

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration))
});

class Login extends Component {
  constructor () {
    super();
    this.login = this.login.bind(this);
  }

  login (evt) {
    evt.preventDefault();

    const email = this.email.value;
    const password = this.password.value;

    if (email === '' || password === '') {
      this.props.toasting(['email ou/et mot de passe manquant.']);
      return;
    }

    this.connectAndStoreToken(email, password)
      .catch(err => console.error(err));
  }

  async connectAndStoreToken (email, password) {
    const response = await fetch(`${Constants.AUTH_URL}/local/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    });

    // user does not exist
    if (response.status === 204) {
      this.props.toasting([`Cet utilisateur n'existe pas.`]);
      return;
    }

    const data = await response.json();

    // bad typing
    if (response.status === 400) {
      const errors = data.error.map(err => err.msg);
      this.props.toasting(errors);
      return;
    }

    // server error
    if (response.status === 500) {
      this.props.toasting([data.error]);
      return;
    }

    localStorage.setItem('streamwave-token', data.token);
    const credentials = await this.storeCredentials(email, password);
    this.props.history.push('/');
  }

  async storeCredentials (email, password) {
    if (Constants.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      const credentials = await navigator.credentials.create({
        password: {
          id: email,
          password
        }
      });
      return navigator.credentials.store(credentials);
    }
  }

  render () {
    return (
      <Container>
        <Form onSubmit={this.login}>
          <InputWrapper>
            <Label htmlFor="email">E-mail</Label>
            <input ref={input => this.email = input} type="email" id="email" autocomplete="email"/>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="password">Mot de passe</Label>
            <input ref={input => this.password = input} type="password" id="password" autocomplete="current-password"/>
          </InputWrapper>
          <FormButton aria-label="login">
            Se connecter
          </FormButton>
        </Form>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Login);
