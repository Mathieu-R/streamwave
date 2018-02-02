import { Component } from 'preact';

class Forgot extends Component {
  constructor () {
    super();
    this.sendPasswordChangeEmail = this.sendPasswordChangeEmail.bind(this);
  }

  sendPasswordChangeEmail (evt) {
    evt.preventDefault();
  }

  render () {
    return (
      <div class="forgot">
      <form class="forgot-form" onSubmit={this.sendPasswordChangeEmail}>
        <div class="forgot-form__email input-wrapper">
          <label for="email" class="forgot-form__email__label">E-mail</label>
          <input type="email" id="email" class="forgot-form__email__input"/>
        </div>
        <button type="submit" class="forgot-button">
          Envoyer un e-mail de changement de mot de passe
        </button>
      </form>
      </div>
    );
  }
}

export default Forgot;
