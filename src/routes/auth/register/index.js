import { Component } from 'preact';

class Register extends Component {
  constructor () {
    super();
    this.register = this.register.bind(this);
  }

  register (evt) {
    evt.preventDefault();
  }

  render () {
    return (
      <div class="register">
        <form class="register-form" onSubmit={this.register}>
          <div class="register-form__email input-wrapper">
            <label for="email" class="register-form__email__label">E-mail</label>
            <input type="email" id="email" class="register-form__email__input"/>
          </div>
          <div class="register-form__password input-wrapper">
            <label for="password" class="register-form__password__label">Mot de passe</label>
            <input type="password" id="password" class="register-form__password__input"/>
          </div>
          <div class="register-form__password-confirm input-wrapper">
            <label for="password-confirm" class="register-form__password-confirm__label">Confirmation du mot de passe</label>
            <input type="password" id="password-confirm" class="register-form__password-confirm__input"/>
          </div>
          <button type="submit" class="register-button">
            Créer un compte
          </button>
        </form>
      </div>
    );
  }
}

export default Register;
