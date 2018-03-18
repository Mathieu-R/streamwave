import { Component } from 'preact';
import Constants from '../../constants';

class Reset extends Component {
  constructor () {
    super();
    this.reset = this.reset.bind(this);
  }

  reset (evt) {
    evt.preventDefault();

    const password = this.password.value;
    const passwordConfirm = this.passwordConfirm.value;

    if (password === '' || passwordConfirm === '') {
      this.props.toasting(['Vérifiez que vous avez bien rempli tous les éléments du formulaire.']);
      return;
    }

    if (password !== passwordConfirm) {
      this.props.toasting(['Les mots de passes ne sont pas équivalents.']);
      return;
    }

    this.performReset(password, token)
      .catch(err => console.error(err));
  }

  async performReset () {
    const response = await fetch(`${Constants.AUTH_URL}/local/account/reset/reset-password?token=${token}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        password
      })
    });

    // server error
    if (response.status === 500) {
      this.props.toasting(['Erreur lors du changement de mot de passe.']);
      return;
    }

    const data = await response.json();

    // token invalid or expired
    if (response.status === 400) {
      this.props.toasting(data.error);
      return;
    }

    // password changed
    this.props.toasting(data.message);
  }

  render () {
    return (
      <div class="reset">
        <form class="reset-form" onSubmit={this.reset}>
          <div class="reset-form__password input-wrapper">
            <label for="password" class="reset-form__password__label">Nouveau mot de passe</label>
            <input ref={input => this.password = input} type="password" id="password" class="reset-form__password__input" autocomplete="new-password"/>
          </div>
          <div class="reset-form__password-confirm input-wrapper">
            <label for="password-confirm" class="reset-form__password-confirm__label">Confirmation du nouveau mot de passe</label>
            <input ref={input => this.passwordConfirm = input} type="password" id="password-confirm" class="reset-form__password-confirm__input" autocomplete="new-password"/>
          </div>
          <button type="submit" class="reset-button">
            Créer un compte
          </button>
        </form>
      </div>
    );
  }
}

export default Reset;
