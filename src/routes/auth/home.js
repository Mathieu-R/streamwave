import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Container, Wrapper, LinkButton } from '../../components/ui';
import decode from 'jwt-decode';
import styled from 'styled-components';
import Constants from '../../constants';
import '../../third_party/gapi';

import {
  storeUser
} from '../../store/user';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  storeUser: user => dispatch(storeUser(user))
});

const Welcome = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 270px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 36px;
  text-align: center;

  &::after {
    content: '';
    display: flex;
    height: 1px;
    background: #FFF;
    border: none;
  }
`;

const Subtitle = styled.span`
  color: ${props => props.theme.welcome.subtitle.color};
  font-size: 12px;
  text-align: center;
  margin: 2px 0;
`;

const ButtonsContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Button = styled.button`
  height: 55px;
  width: 100%;
  margin: 17px 0;
  border-radius: 27px;
`;

const LoginButton = styled(Button)`
  background: ${props => props.theme.auth.background};
`;

const RegisterButton = styled(Button)`
  background: ${props => props.theme.auth.background};
`;

const GoogleButton = styled(Button)`
  background: ${props => props.theme.auth.google.background};
`;

const AuthLink = styled(LinkButton)`
  color: #FFF;
  font-size: 18px;
  /* fix: <a> does not take height of the button parent if firefox */
  height: 55px;
`;

const PasswordResetLink = styled(LinkButton)`
  font-size: 12px;
  text-decoration: underline;
  color: #FFF;
  text-align: center;
`;

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
        mediation: 'silent' // prevent browser to show account choser
      });

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

        // TODO: maybe fix ?
        const data = await response.json();
        localStorage.setItem('streamwave-token', data.token);
        this.props.history.push('/');
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
      this.storeFederatedCredentials(user).then(_ => {
        this.props.history.push('/');
      });
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
      <Container>
        <Wrapper>
          <Welcome>
            <Title>Streamwave</Title>
            <Subtitle>streaming music pwa</Subtitle>
          </Welcome>
          <ButtonsContainer>
            <LoginButton aria-label="go to login page">
              <AuthLink to="/auth/login">
                Se connecter
              </AuthLink>
            </LoginButton>
            <RegisterButton aria-label="go to register page">
              <AuthLink to="/auth/register">
                Créer un compte
              </AuthLink>
            </RegisterButton>
            <GoogleButton onClick={this.googleLogin} aria-label="login with your google account">
              Continuer avec google
            </GoogleButton>
            <PasswordResetLink to="/auth/forgot" aria-label="go to password reset page">
              Mot de passe oublié ?
            </PasswordResetLink>
          </ButtonsContainer>
        </Wrapper>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
