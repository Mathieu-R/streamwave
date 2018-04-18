import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Container, Wrapper as Form, InputWrapper, Label, FormButton } from '../../components/ui';
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
      <Container>
        <Form onSubmit={this.register}>
          <InputWrapper class="register-form__email input-wrapper">
            <Label for="email">E-mail</Label>
            <input ref={input => this.email = input} type="email" id="email" class="register-form__email__input" autocomplete="email"/>
          </InputWrapper>
          <InputWrapper class="register-form__password input-wrapper">
            <Label for="password">Mot de passe</Label>
            <input ref={input => this.password = input} type="password" id="password" class="register-form__password__input" autocomplete="new-password"/>
          </InputWrapper>
          <InputWrapper class="register-form__password-confirm input-wrapper">
            <Label for="password-confirm">Confirmation du mot de passe</Label>
            <input ref={input => this.passwordConfirm = input} type="password" id="password-confirm" class="register-form__password-confirm__input" autocomplete="new-password"/>
          </InputWrapper>
          <FormButton type="submit" aria-label="register">
            Créer un compte
          </FormButton>
        </Form>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Register);
