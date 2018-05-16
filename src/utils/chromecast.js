import { get, set, del } from 'idb-keyval';
import { isMobile } from './index';
import Constants from '../constants';
import store from '../store';

import {
  setChromecastStatus,
  setChromecastAvailable
} from '../store/player';

class Chromecaster {
  constructor (url, audio) {
    this.connection = null;

    this.send = this.send.bind(this);
    this.stop = this.stop.bind(this);

    if (isMobile() && Constants.SUPPORT_REMOTE_PLAYBACK_API) {
      // presentation api is only supported on mobile
      // with the chrome sdk + url of type cast:<cast-id>
      // don't like this approach
      // in that case => switch on Remote Playback API if supported
      this.monitorRemoteAvailability(audio);
    } else if (Constants.SUPPORT_PRESENTATION_API) {
      // on desktop, if presentation api is supported, use it.
      this.request = new PresentationRequest(url);
      this.monitorPresentationAvailability();
    } else {
      // if nothing is supported
      // remove chromecast button
      this.updateChromecastButtonDisplay({available: false});
    }

    //navigator.presentation.defaultRequest = this.request;
    //navigator.presentation.defaultRequest.onconnectionavailable = this.onConnectionAvailable;
  }

  static get CLOSED_STATE () {
    return 'closed';
  }

  static get CHROMECAST_IDB_KEY () {
    return 'chromecast_presentation_id';
  }

  monitorPresentationAvailability () {
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

  // cast audio
  // through Presentation API
  // or Remote Playback API
  // presenting: true => presentation api chosen
  // presenting: false => remote playback api chosen
  cast (audio) {
    if (isMobile()) {
      // on mobile remote audio
      return this.remote(audio).then(() => ({presenting: false}));
    }

    this.present().then(() => ({presenting: true}));
  }

  present () {
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

  monitorRemoteAvailability (audio) {
    return audio.remote.watchAvailability(available => {
      this.updateChromecastButtonDisplay({available});
    }).catch(_ => {
      // same logic as for presentation api
      // assume remote device is available
      this.updateChromecastButtonDisplay({available: true});
    })
  }

  remote (audio) {
    audio.remote.onconnecting = _ => {
      this.updateUI({chromecasting: true});
      // do not need to track device availibility anymore
      audio.remote.cancelWatchAvailibility();
    }

    // from Remote Playback API spec.
    // handles both 'connecting' and 'connected' state. Calling more than once
    // is a no-op.
    audio.remote.onconnect = _ => {
      this.updateUI({chromecasting: true});
      // do not need to track device availibility anymore
      audio.remote.cancelWatchAvailibility();
    }

    audio.remote.ondisconnect = _ => {
      this.updateUI({chromecasting: true});
      // track device availability again
      this.monitorRemoteAvailability();
    }

    return audio.remote.prompt();
  }
}

export default Chromecaster;
