export default class Constants {
  static get PRESENTATION_ID() {
    return 'A7FCF506'
  }

  static get SUPPORT_INTERSECTION_OBSERVER() {
    return 'IntersectionObserver' in window
  }

  static get SUPPORT_MEDIA_SESSION_API() {
    return navigator.mediaSession
  }

  static get SUPPORT_REMOTE_PLAYBACK_API() {
    return 'remote' in HTMLMediaElement.prototype
  }

  static get SUPPORT_PRESENTATION_API() {
    return 'PresentationRequest' in window
  }

  static get SUPPORT_SERVICE_WORKER() {
    return 'serviceWorker' in navigator
  }

  static get SUPPORT_CACHE_API() {
    return 'caches' in window
  }

  static get SUPPORT_PUSH_NOTIFICATIONS() {
    return 'PushManager' in window
  }

  static get SUPPORT_STREAMS() {
    return 'ReadableStream' in window
  }

  static get SUPPORT_STORAGE_API() {
    return 'storage' in navigator
  }

  static get SUPPORT_BACKGROUND_SYNC() {
    return 'serviceWorker' in navigator && 'SyncManager' in window
  }

  static get SUPPORT_BACKGROUND_FETCH() {
    return 'BackgroundFetchManager' in window
  }
}
