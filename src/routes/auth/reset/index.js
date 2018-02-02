import { Component } from 'preact';

class Reset extends Component {
  render () {
    return (
      <div class="reset">
        <form class="reset-form" onSubmit={reset}>
          <div class="reset-form__password">
            <label for="password" class="reset-form__password__label">Nouveau mot de passe</label>
            <input type="password" id="password" class="reset-form__password__input"/>
          </div>
          <div class="reset-form__password-confirm">
            <label for="password-confirm" class="reset-form__password-confirm__label">Confirmation du nouveau mot de passe</label>
            <input type="password" id="password-confirm" class="reset-form__password-confirm__input"/>
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
