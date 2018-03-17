import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../../constants';

import { toasting } from '../../store/toast';

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration))
});

class Register extends Component {
  constructor () {
    super();
    this.register = this.register.bind(this);
  }

  register (evt) {
    evt.preventDefault();

    const email = this.email.value;
    const password = this.password.value;
    const passwordConfirm = this.passwordConfirm.value;

    if (email === '' || password === '' || passwordConfirm === '') {
      this.props.toasting(['Vérifiez que vous avez bien rempli tous les éléments du formulaire.']);
      return;
    }

    if (password !== passwordConfirm) {
      this.props.toasting(['Les mots de passes ne sont pas équivalents.']);
      return;
    }

    this.performRegister(email, password)
      .catch(err => console.error(err));
  }

  async performRegister (email, password) {
    const response = await fetch(`${Constants.AUTH_URL}/local/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    });

    // bad typing, password not strong enough or email already used
    if (response.status === 400) {
      const errors = data.error.map(err => err.msg);
      this.props.toasting(errors);
      return;
    }

    if (response.status === 204) {
      this.props.toasting(['Cet utilisateur existe déjà...']);
    }

    // server error
    if (response.status === 500) {
      this.props.toasting(['Erreur lors de la création du compte.']);
      return;
    }

    const data = await response.json();

    // user created, mail sent
    this.props.toasting(data.message);
  }

  render () {
    return (
      <div class="register">
        <form class="register-form" onSubmit={this.register}>
          <div class="register-form__email input-wrapper">
            <label for="email" class="register-form__email__label">E-mail</label>
            <input ref={input => this.email = input} type="email" id="email" class="register-form__email__input" autocomplete="email"/>
          </div>
          <div class="register-form__password input-wrapper">
            <label for="password" class="register-form__password__label">Mot de passe</label>
            <input ref={input => this.password = input} type="password" id="password" class="register-form__password__input" autocomplete="new-password"/>
          </div>
          <div class="register-form__password-confirm input-wrapper">
            <label for="password-confirm" class="register-form__password-confirm__label">Confirmation du mot de passe</label>
            <input ref={input => this.passwordConfirm = input} type="password" id="password-confirm" class="register-form__password-confirm__input" autocomplete="new-password"/>
          </div>
          <button type="submit" class="register-button">
            Créer un compte
          </button>
        </form>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Register);
