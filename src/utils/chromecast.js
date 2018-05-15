import { get, set, del } from 'idb-keyval';
import store from '../store';

import {
  setChromecastStatus,
  setChromecastAvailable
} from '../store/player';

class Chromecaster {
  constructor (url) {
    this.connection = null;

    this.send = this.send.bind(this);
    this.stop = this.stop.bind(this);

    this.request = new PresentationRequest(url);
    this.monitorAvailability();
    //navigator.presentation.defaultRequest = this.request;
    //navigator.presentation.defaultRequest.onconnectionavailable = this.onConnectionAvailable;
  }

  static get CLOSED_STATE () {
    return 'closed';
  }

  static get CHROMECAST_IDB_KEY () {
    return 'chromecast_presentation_id';
  }

  monitorAvailability () {
    // monitor receiver availability
    // not if we are connected
    // useful to know if we shoud show/hide
    // chromecast button
    this.request.getAvailability().then(availability => {
      const available = availability.value;
      this.updateChromecastButtonDisplay({available: available});

      availability.onchange = evt => {
        this.updateChromecastButtonDisplay({available: evt.target.value});
      }
    }).catch(_ => {
      // availibility monitoring is not available on that platform
      // assuming receiver is available
      this.updateChromecastButtonDisplay({available: true});
    });
  }

  async setConnection (connection) {
    return new Promise(async resolve => {
      // 1. disconnect from existing presentation if any
      if (this.connection && this.connection !== connection && this.connection.state !== Chromecaster.CLOSED_STATE) {
        this.connection.close();
      }

      // 2. set the connection, save the presentation id in cache in order to allow reconnection
      this.connection = connection;
      await set(Chromecaster.CHROMECAST_IDB_KEY, connection.id);

      // event listeners
      this.connection.onmessage = evt => {
        console.log(`message from: ${evt.id}. Received data type: "${evt.data}"`);
      }

      this.connection.onconnect = _ => {
        this.updateUI({chromecasting: true});
        resolve();
      }

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
    });
  }

  updateChromecastButtonDisplay ({available}) {
    return store.dispatch(setChromecastAvailable({available}));
  }

  updateUI ({chromecasting}) {
    return store.dispatch(setChromecastStatus({chromecasting}));
  }

  cast () {
    return new Promise(async (resolve) => {
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

  sendTrackInformations () {
    const state = store.getState();
    const data = {
      type: 'song',
      artist: state.player.artist,
      album: state.player.album,
      track: state.player.track,
      currentTime: state.player.currentTime,
      playing: state.player.playing,
      primaryColor: state.player.primaryColor
    };
    console.log(data.track);
    this.send(data);
  }

  send (data) {
    if (!this.connection) {
      console.warn('[Presentation API] no active connection...');
      return;
    }

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
    this.connection.terminate();
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
