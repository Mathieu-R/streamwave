import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Container, Form, InputWrapper, Label, FormButton } from '../../components/ui';
import Constants from '../../constants';

import {
  toasting
} from '../../store/toast';

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration))
});

class Reset extends Component {
  constructor () {
    super();
    this.reset = this.reset.bind(this);
  }

  reset (evt) {
    evt.preventDefault();

    const token = this.props.match.params.token;
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

  async performReset (password, token) {
    const response = await fetch(`${Constants.AUTH_URL}/local/account/reset/change-password?token=${token}`, {
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
      this.props.toasting([data.error]);
      return;
    }

    // password changed
    this.props.toasting([data.message]);
    this.props.history.push('/auth');
  }

  render () {
    return (
      <Container>
        <Form onSubmit={this.reset}>
          <InputWrapper>
            <Label for="password">Nouveau mot de passe</Label>
            <input ref={input => this.password = input} type="password" id="password" autocomplete="new-password"/>
          </InputWrapper>
          <InputWrapper>
            <Label for="password-confirm">Confirmation du nouveau mot de passe</Label>
            <input ref={input => this.passwordConfirm = input} type="password" id="password-confirm" autocomplete="new-password"/>
          </InputWrapper>
          <FormButton type="submit" aria-label="change password">
            Changer de mot de passe
          </FormButton>
        </Form>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Reset);
