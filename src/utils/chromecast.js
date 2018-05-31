import store from '../store';
import Constants from '../constants';
import {
  setChromecastAvailable,
  setChromecastStatus
} from '../store/player';

class Chromecaster {
  constructor (castProxy) {
    this.castProxy = castProxy;
  }

  castIfNeeded () {
    if (this.castProxy.isCasting()) {
      this.stop();
      //this.updateUI({chromecasting: false});
      return;
    }

    this.castProxy.setAppData(this.getMediaInfo());
    this.castProxy.cast().then(() => {
      console.log(`casting on a remote device: ${this.castProxy.receiverName()}`);
      //this.updateUI({chromecasting: true});
    }).catch(err => {
      console.error(err);
    })
  }

  onCastStatusChange () {
    const canCast = this.castProxy.canCast();
    const isCasting = this.castProxy.isCasting();

    if (this.canCast !== canCast) {
      this.canCast = canCast;
      this.updateChromecastButtonDisplay({available: this.canCast ? true : false});
    }

    if (this.isCasting !== isCasting) {
      this.updateUI({chromecasting: this.isCasting ? true : false});
    }
    //const receiverName = this.castProxy.receiverName();
  }

  stop () {
    // Show a dialog where user can choose to disconnect from the cast connection
    // could also force with forceDisconnect()
    this.castProxy.suggestDisconnect();
  }

  updateReceiverUI () {
    this.castProxy.setAppData(this.getMediaInfo());
  }

  getMediaInfo () {
    const state = store.getState();
    const data = {
      artist: state.player.artist,
      album: state.player.album,
      title: state.player.track.title,
      number: state.player.track.number,
      year: state.player.year,
      coverURL: `${Constants.CDN_URL}/${state.player.track.coverURL}`,
      currentTime: state.player.currentTime,
      //playing: state.player.playing,
      //primaryColor: state.player.primaryColor
    };
    return data;
  }

  updateChromecastButtonDisplay ({available}) {
    return store.dispatch(setChromecastAvailable({available}));
  }

  updateUI ({chromecasting}) {
    return store.dispatch(setChromecastStatus({chromecasting}));
  }
}

export default Chromecaster;
