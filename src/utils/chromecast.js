import { get, set, del } from 'idb-keyval';
import Constants from '../constants';
import store from '../store';

import {
  setChromecastStatus,
  setChromecastAvailable
} from '../store/player';

class Chromecaster {
  constructor () {
    this.connection = null;

    this.send = this.send.bind(this);
    this.stop = this.stop.bind(this);

    if (Constants.SUPPORT_PRESENTATION_API) {
      // on desktop, if presentation api is supported, use it.
      this.request = new PresentationRequest(Constants.PRESENTATION_ID);
      // Make this presentation the default one when using the "Cast" browser menu.
      navigator.presentation.defaultRequest = this.request;
      this.monitorPresentationAvailability();
    } else {
      // if nothing is supported
      // remove chromecast button
      this.updateChromecastButtonDisplay({available: false});
    }
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
      console.log('chromecast available', available);
      this.updateChromecastButtonDisplay({available});

      availability.onchange = evt => {
        console.log('chromecast available - availabily change', evt.target.value);
        this.updateChromecastButtonDisplay({available: evt.target.value});
      }
    }).catch(_ => {
      console.log('chromecast available - catch', false);
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
      window.__connection__ = connection;
      await set(Chromecaster.CHROMECAST_IDB_KEY, connection.id);

      // event listeners
      this.connection.onmessage = evt => {
        console.log(`message from: ${evt.target.id}. Received: "${evt.data}"`);
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
  cast (audio) {
    return this.present()
      .then(() => ({presenting: true}))
      .catch(err => {
        console.error(err);
        return del(Chromecaster.CHROMECAST_IDB_KEY).then(() => {
          console.warn('Try casting again :)');
        });
      })
  }

  async present () {
    // // try to reconnect to old presentation
    // const id = await get(Chromecaster.CHROMECAST_IDB_KEY);
    // console.log(id);

    // if (!id) {
    //   this.connection = await this.request.start();
    // } else {
    //   this.connection = await this.reconnect(id);
    // }

    this.connection = await this.request.start();

    console.log('Connected to ' + this.connection.url + ', id: ' + this.connection.id);


    this.request.onconnectionavailable = evt => {
      this.updateUI({chromecasting: true});
      set(Chromecaster.CHROMECAST_IDB_KEY, evt.connection.id).then(() => {
        this.sendTrackInformations();
      });
    }

    this.connection.onmessage = evt => {
      console.log('Received message', evt);
    }

    this.connection.onterminate = _ => {
      del(Chromecaster.CHROMECAST_IDB_KEY).then(_ => {
        this.connection = null;
        this.updateUI({chromecasting: false});
      });
    }
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
}

export default Chromecaster;
