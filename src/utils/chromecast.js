import { get, set, del } from 'idb-keyval';
import { isMobile } from './index';
import Constants from '../constants';
import store from '../store';

import {
  setChromecastStatus,
  setChromecastAvailable
} from '../store/player';

class Chromecaster {
  constructor () {
    this.cast = this.cast.bind(this);

    window.__onGCastApiAvailable = (available) => {
      if (available) {
        this.init();
      }
    }
  }

  init () {
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: '9F0538CD',
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
    console.log(cast.framework.CastContext.getInstance().getCurrentSession());
  }

  cast (manifest, mimetype = 'audio/mpeg') {
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = new chrome.cast.media.MediaInfo(manifest, mimetype);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    console.log(castSession);

    castSession.loadMedia(request)
      .then(() => {
        console.log('[Google Cast] Loaded.');
        this.player = new cast.framework.RemotePlayer();
        this.controller = new cast.framework.RemotePlayerController(this.player);
        this.controller.playOrPause();
      })
      .catch(err => console.error(err));
  }

  pause () {
    this.controller.playOrPause();
  }

  stop () {
    this.controller.stop();
  }

  seek () {
    this.controller.seek();
  }
}

export default Chromecaster;
