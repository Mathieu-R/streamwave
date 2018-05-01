import { get, set, del } from 'idb-keyval';

class Chromecaster {
  constructor () {
    this.request = null;
    this.connection = null;
  }

  static get CLOSED_STATE () {
    return 'closed';
  }

  static get CHROMECAST_IDB_KEY () {
    return 'chromecast_presentation_id';
  }

  async onConnectionAvailbale (evt) {
    console.log(evt);
    // 1. disconnect from existing presentation if any
    if (this.connection && this.connection !== evt.connection && this.connection.state !== Chromecaster.CLOSED_STATE) {
      this.connection.close();
    }

    // 2. set the connection, save the presentation id in cache in order to allow reconnection
    this.connection = evt.connection;
    await set(Chromecaster.CHROMECAST_IDB_KEY, evt.connection.id);

    // event listeners
    this.connection.onclose = _ => this.connection = null;
    this.connection.onterminate = _ => {
      del(Chromecaster.CHROMECAST_IDB_KEY).then(_ => this.connection = null);
    }
  }

  cast (url) {
    this.request = new PresentationRequest([url]);
    navigator.presentation.defaultRequest = this.request;
    navigator.presentation.defaultRequest.onconnectionavailable = this.onConnectionAvailbale;

    return this.request.start();
  }

  reconnect () {
    get(Chromecaster.CHROMECAST_IDB_KEY).then(id => {
      if (!id) {
        return;
      }

      return navigator.presentation.defaultRequest.reconnect(id).then(this.onConnectionAvailbale);
    });
  }

  stop () {
    if (!this.connection) {
      return;
    }

    // stop() still allow to reconnect unlike terminate()
    this.connection.stop();
  }

  /* Remote Playback API - not available in chrome desktop for now */

  watchRemoteAvailability (audio) {
    return new Promise(resolve => {
      return audio.remote.watchAvailability(available => resolve(available));
    });
  }

  remote (audio) {
    return audio.remote.prompt();
  }
}

export default Chromecaster;
