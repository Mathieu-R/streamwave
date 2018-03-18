import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../../constants';

import {
  toasting
} from '../../store/toast';

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration))
});

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

    this.getChangePasswordEmail(email)
      .catch(err => console.error(err));
  }

  async getChangePasswordEmail (email) {
    const response = await fetch(`${Constants.AUTH_URL}/local/account/reset/get-reset-token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    });

    // email does not exist
    if (response.status === 204) {
      this.props.toasting([`Cet e-mail n'existe pas.`]);
      return;
    }

    // reset account failed
    if (response.status === 500) {
      this.props.toasting(['Erreur lors de la demande de changement de mot de passe.']);
      return;
    }

    // email sent, check it to change your password
    const data = await response.json();
    this.props.toasting(data.message);
  }

  render () {
    return (
      <div class="forgot">
      <form class="forgot-form" onSubmit={this.sendPasswordChangeEmail}>
        <div class="forgot-form__email input-wrapper">
          <label for="email" class="forgot-form__email__label">E-mail</label>
          <input ref={input => this.email = input} type="email" id="email" class="forgot-form__email__input" autocomplete="email"/>
        </div>
        <button type="submit" class="forgot-button">
          Envoyer un e-mail de changement de mot de passe
        </button>
      </form>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Forgot);
