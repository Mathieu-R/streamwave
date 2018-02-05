import { Component } from 'preact';
//import worker from 'workerize!../../../worker';

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

    worker().login(email, password)
      .then(token => localStorage.setItem('streamwave-token', token))
      .catch(err => console.error(err));
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
