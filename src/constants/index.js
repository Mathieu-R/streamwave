const production = process.env.NODE_ENV === 'production';

class Constants {
  static get AUTH_URL () {
    return (
      production ? 'https://auth.streamwave.be' : 'http://localhost:3000'
    );
  }

  static get API_URL () {
    return (
      production ? 'https://api.streamwave.be/v1' : 'http://localhost:5000'
    );
  }

  static get SUPPORT_CREDENTIALS_MANAGEMENT_API () {
    return (navigator.credentials && navigator.credentials.preventSilentAccess);
  }
}

export default Constants;
