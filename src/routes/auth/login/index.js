import { Component } from 'preact';

class Login extends Component {
  render () {
    return (
      <div class="login">
        <form class="login-form" onSubmit={login}>
          <div class="login-form__email">
            <label for="email" class="login-form__email__label">E-mail</label>
            <input type="email" id="email" class="login-form__email__input"/>
          </div>
          <div class="login-form__password">
            <label for="password" class="login-form__password__label">Mot de passe</label>
            <input type="password" id="password" class="login-form__password__input"/>
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
