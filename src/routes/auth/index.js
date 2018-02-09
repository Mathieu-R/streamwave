import { Component } from 'preact';
import { connect } from 'unistore/preact';
import decode from 'jwt-decode';
import Constants from '../../constants';
import '../../third_party/gapi';

@connect(['user'], { storeUser: 'storeUser'})
class Auth extends Component {
  constructor () {
    super();

    this.GOOGLE_CLIENT_ID = '518872171102-tpqle4q49rihv2atopm4c0uvnumochtd.apps.googleusercontent.com';
    this.googleLogin = this.googleLogin.bind(this);
  }

  componentDidMount () {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: this.GOOGLE_CLIENT_ID
      }).then(() => {
        console.log('[OAUTH2] gapi init.');
        this.autoSignOnConnect()
          .catch(err => console.error(err));
      });
    });
  }

  async autoSignOnConnect () {
    if (Constants.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      const credentials = await navigator.credentials.get({
        password: true,
        federated: {
          providers: ['https://accounts.google.com']
        },
        //mediation: 'silent' // prevent browser to show account choser
      });

      console.log(credentials);

      if (!credentials) return;
      if (credentials.type === 'password') {
        const response = await fetch(`${Constants.AUTH_URL}/local/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.id,
            password: credentials.password
          })
        });
        return;
      }

      if (credentials.type === 'federated') {
        this.googleLogin().catch(err => console.error(err));
        return;
      }
    }
  }

  googleLogin (evt) {
    let gid = '';
    const auth = gapi.auth2.getAuthInstance();
    auth.signIn({
      login_hint: gid || ''
    }).then(profile => {
      const token = profile.getAuthResponse().id_token;
      return fetch(`${Constants.AUTH_URL}/google/login`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
    })
    .then(response => response.json())
    .then(({token}) => {
      localStorage.setItem('streamwave-token', token);
      return decode(token);
    })
    .then(user => {
      this.props.storeUser(user);
      return this.storeFederatedCredentials(user);
    })
    .catch(err => console.error(err));
  }

  async storeFederatedCredentials (profile) {
    if (Constants.SUPPORT_CREDENTIALS_MANAGEMENT_API) {
      const credentials = await navigator.credentials.create({
        federated: {
          id: profile.id,
          provider: 'https://accounts.google.com',
          name: profile.username,
          iconURL: profile.avatar
        }
      });
      return navigator.credentials.store(credentials);
    }
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
            <button class="auth-buttons__google" onClick={this.googleLogin}>
              Continuer avec google
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
