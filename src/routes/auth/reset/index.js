import { Component } from 'preact';
import worker from 'workerize!../../../worker';

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

    worker().changePassword(password, token)
      .then(message => this.props.toasting([message]))
      .catch(err => console.error(err));
  }

  render () {
    return (
      <div class="reset">
        <form class="reset-form" onSubmit={this.reset}>
          <div class="reset-form__password input-wrapper">
            <label for="password" class="reset-form__password__label">Nouveau mot de passe</label>
            <input ref={input => this.password = input} type="password" id="password" class="reset-form__password__input"/>
          </div>
          <div class="reset-form__password-confirm input-wrapper">
            <label for="password-confirm" class="reset-form__password-confirm__label">Confirmation du nouveau mot de passe</label>
            <input ref={input => this.passwordConfirm = input} type="password" id="password-confirm" class="reset-form__password-confirm__input"/>
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
