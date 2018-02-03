import { Component } from 'preact';
import workerize from 'workerize';

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
    }

    workerize(this.loginFetch)
      .then(token => localStorage.setItem('streamwave-token', token))
      .catch(err => console.error(err));
  }

  async loginFetch (email, password) {
    const response = await fetch(`${Constants.AUTH_URL}/local/login`, {
      method: 'POST',
      body: JSON.stringify({
        email, password
      })
    });

    const data = await response.json();

    // bad typing
    if (response.status === 400) {
      // data.error
    }

    // user does not exist
    if (response.status === 204) {

    }

    // server error
    if (response.status === 500) {
      // data.error
    }

    // user logged, token received
    // should save it into idb since localStore
    // is unavailable in web workers
    // unless I do not use stockroom for that
    return data.token
  }

  render () {
    return (
      <div class="login">
        <form class="login-form" onSubmit={this.login}>
          <div class="login-form__email input-wrapper">
            <label for="email" class="login-form__email__label">E-mail</label>
            <input ref={input => this.email = input} type="email" id="email" class="login-form__email__input"/>
          </div>
          <div class="login-form__password input-wrapper">
            <label for="password" class="login-form__password__label">Mot de passe</label>
            <input ref={input => this.password = input} type="password" id="password" class="login-form__password__input"/>
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
