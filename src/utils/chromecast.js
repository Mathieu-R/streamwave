import { get, set, del } from 'idb-keyval';
import store from '../store';

import {
  setChromecastStatus
} from '../store/player';

class Chromecaster {
  constructor () {
    this.request = null;
    this.connection = null;

    this.send = this.send.bind(this);
    this.stop = this.stop.bind(this);
  }

  static get CLOSED_STATE () {
    return 'closed';
  }

  static get CHROMECAST_IDB_KEY () {
    return 'chromecast_presentation_id';
  }

  async setConnection (connection) {
    // 1. disconnect from existing presentation if any
    if (this.connection && this.connection !== connection && this.connection.state !== Chromecaster.CLOSED_STATE) {
      this.connection.close();
    }

    // 2. set the connection, save the presentation id in cache in order to allow reconnection
    this.connection = connection;
    await set(Chromecaster.CHROMECAST_IDB_KEY, connection.id);

    // event listeners
    this.connection.onclose = _ => {
      this.connection = null;
      this.updateUI({chromecasting: false});
    }

    this.connection.onterminate = _ => {
      del(Chromecaster.CHROMECAST_IDB_KEY).then(_ => {
        this.connection = null;
        this.updateUI({chromecasting: false});
      });
    }
  }

  updateUI ({chromecasting}) {
    return store.dispatch(setChromecastStatus({chromecasting}));
  }

  cast (url) {
    return new Promise(async (resolve) => {
      this.request = new PresentationRequest(url);
      navigator.presentation.defaultRequest = this.request;
      navigator.presentation.defaultRequest.onconnectionavailable = this.onConnectionAvailable;

      // monitor receiver availability
      this.request.getAvailability().then(availability => {
        const available = availability.value;
        this.updateUI({chromecasting: available});

        availability.onchange = evt => {
          this.updateUI({chromecasting: evt.value});
        }
      }).catch(_ => {
        // availibility monitoring is not available on that platform
        // assuming receiver is available
        this.updateUI({chromecasting: true});
      });

      await this.request.start();

      // wait until connection is available
      // otherwise we send data before connection is ready
      this.request.onconnectionavailable = async evt => {
        await this.setConnection(evt.connection);
        resolve();
      }

      // try to reconnect to old presentation
      // const id = await get(Chromecaster.CHROMECAST_IDB_KEY);
      // let connection;

      // if (!id) {
      //   console.log(this.request);
      //   this.request.start().then(connection => this.connection = connection);
      // } else {
      //   this.reconnect(id);
      // }
    });
  }

  send (data) {
    if (!this.connection) {
      console.warn('[Presentation API] no active connection...');
      return;
    }

    console.log(this.connection);
    this.connection.send(JSON.stringify(data));
  }

  reconnect (id) {
    return navigator.presentation.defaultRequest.reconnect(id);
  }

  stop () {
    if (!this.connection) {
      return;
    }

    // close() still allow to reconnect unlike terminate()
    this.connection.close();
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
