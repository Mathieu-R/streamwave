import store from '../store';

class Chromecaster {
  constructor (castProxy) {
    this.castProxy = castProxy;
  }

  castIfNeeded () {
    if (this.castProxy.isCasting()) {
      this.stop();
      this.updateUI({chromecasting: false});
      return;
    }

    this.castProxy.cast().then(() => {
      this.updateUI({chromecasting: true});
    }).catch(err => {
      console.error(err);
    })
  }

  onCastStatusChange () {
    const canCast = this.castProxy.canCast();
    const isCasting = this.castProxy.isCasting();
    //const receiverName = this.castProxy.receiverName();

    this.updateChromecastButtonDisplay({available: canCast ? true : false});
  }

  stop () {
    // Show a dialog where user can choose to disconnect from the cast connection
    // could also force with forceDisconnect()
    this.castProxy.suggestDisconnect();
  }

  updateChromecastButtonDisplay ({available}) {
    return store.dispatch(setChromecastAvailable({available}));
  }

  updateUI ({chromecasting}) {
    return store.dispatch(setChromecastStatus({chromecasting}));
  }
}

export default Chromecaster;
