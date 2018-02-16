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

  static get CDN_URL () {
    return (
      'https://cdn.streamwave.be'
    );
  }

  static get SUPPORT_CREDENTIALS_MANAGEMENT_API () {
    return (navigator.credentials && navigator.credentials.preventSilentAccess);
  }

  static get SUPPORT_INTERSECTION_OBSERVER () {
    return 'intersectionObserver' in window;
  }

  static get SUPPORT_MEDIA_SESSION_API () {
    return navigator.mediaSession;
  }

  static SUPPORT_SERVICE_WORKER () {
    return navigator.serviceWorker;
  }

  static get SUPPORT_BACKGROUND_SYNC () {
    return (navigator.serviceWorker && navigator.SyncManager);
  }

  static get SUPPORT_BACKGROUND_FETCH () {
    return;
  }
}

export default Constants;
