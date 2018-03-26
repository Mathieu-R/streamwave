const production = process.env.NODE_ENV === 'production';

class Constants {
  static get VERSION () {
    return (
      '1.0.0'
    );
  }

  static get PRODUCTION () {
    process.env.NODE_ENV === 'production';
  }

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
    return 'IntersectionObserver' in window;
  }

  static get SUPPORT_MEDIA_SESSION_API () {
    return navigator.mediaSession;
  }

  static get SUPPORT_REMOTE_PLAYBACK_API () {
    return 'remote' in HTMLMediaElement.prototype
  }

  static get SUPPORT_PRESENTATION_API () {
    return 'PresentationRequest' in window;
  }

  static get SUPPORT_SERVICE_WORKER () {
    return 'serviceWorker' in navigator;
  }

  static get SUPPORT_CACHE_API () {
    return 'caches' in window;
  }

  static get SUPPORT_BACKGROUND_SYNC () {
    return ('serviceWorker' in navigator && 'SyncManager' in window);
  }

  static get SUPPORT_BACKGROUND_FETCH () {
    return 'BackgroundFetchManager' in window;
  }
}

export default Constants;
