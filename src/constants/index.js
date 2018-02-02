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
}

export default Constants;
