import { h, Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../../constants';
import styled from 'styled-components';
import { Container, Wrapper as Form, FormButton } from '../../components/ui';

import {
  toasting
} from '../../store/toast';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 17px 0;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 2px;
`;

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
      <Container>
      <Form onSubmit={this.sendPasswordChangeEmail}>
        <InputContainer>
          <Label htmlFor="email">E-mail</Label>
          <input ref={input => this.email = input} type="email" id="email" autocomplete="email"/>
        </InputContainer>
        <FormButton aria-label="send email to change password">
          Envoyer un e-mail de changement de mot de passe
        </FormButton>
      </Form>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Forgot);
