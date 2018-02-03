import { Component } from 'preact';
import worker from 'workerize!../../../worker';

class Forgot extends Component {
  constructor () {
    super();
    this.sendPasswordChangeEmail = this.sendPasswordChangeEmail.bind(this);
  }

  sendPasswordChangeEmail (evt) {
    evt.preventDefault();
    const email = this.email.value;

    if (email === '') {
      this.props.toasting(['E-mail vide.']);
      return;
    }

    worker().getResetToken(email)
      .then(message => this.props.toasting([message]))
      .catch(err => console.error(err));
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
