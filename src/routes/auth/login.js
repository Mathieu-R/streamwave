import { Component } from 'preact';
import { connect } from 'unistore/preact';
import Constants from '../../constants';

@connect(null, { toasting: 'toasting' })
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
      <div class="login">
        <form class="login-form" onSubmit={this.login}>
          <div class="login-form__email input-wrapper">
            <label for="email" class="login-form__email__label">E-mail</label>
            <input ref={input => this.email = input} type="email" id="email" class="login-form__email__input" autocomplete="email"/>
          </div>
          <div class="login-form__password input-wrapper">
            <label for="password" class="login-form__password__label">Mot de passe</label>
            <input ref={input => this.password = input} type="password" id="password" class="login-form__password__input" autocomplete="current-password"/>
          </div>
          <button type="submit" class="login-button">
            Se connecter
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
