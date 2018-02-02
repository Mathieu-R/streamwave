import { Component } from 'preact';
import '../../third_party/gapi';

class Auth extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="auth">
        <section class="auth-wrapper">
          <section class="welcome-title">
            <h1 class="welcome-title__main">Streamwave</h1>
            <span class="welcome-title__subtitle">streaming music pwa</span>
          </section>
          <section class="auth-buttons">
            <button class="auth-buttons__login">
              {/* https://github.com/developit/preact-router#default-link-behavior */}
              <a href="/auth/login" native class="auth-buttons__login__link">
                Se connecter
              </a>
            </button>
            <button class="auth-buttons__register">
              <a href="/auth/register" native class="auth-buttons__register__link">
                Créer un compte
              </a>
            </button>
            <button class="auth-buttons__google">
              Créer un compte
            </button>
            <a href="/auth/forgot" native class="auth__password-reset__link">
              Mot de passe oublié ?
            </a>
          </section>
        </section>
      </div>
    )
  }
}

export default Auth;
