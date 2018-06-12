import { get, set } from 'idb-keyval';
import { urlBase64ToUint8Array } from './index';
import Constants from '../constants';
import store from '../store';

let instance = null

import {
  toasting
} from '../store/toast';

class Pusher {
  constructor () {
    this.subscribing = false;
    this.unsubscribing = false;
    this.key = null;

    if (!instance) {
      instance = this;
    }

    return instance;
  }

  static get IDB_KEY () {
    return 'push-notification-key';
  }

  init () {
    if (Notification.permission === 'denied') {
      return;
    }

    // get a push api subscription (vapid) key
    fetch(`${Constants.API_URL}/push`)
    .then(response => response.text())
    .then(key => {
      console.log(key);
      this.key = key;
      return key;
    })
    .then(key => get(Pusher.IDB_KEY))
    .then(key => {
      // if there's no key stored
      if (!key) {
        set(Pusher.IDB_KEY, this.key);
        return;
      }

      // if there's a key stored
      // but key has changed
      if (this.key !== key) {
        console.log('[PUSH] Subscription key has changed.');
        set(Pusher.IDB_KEY, key);
        return;
      }
    });
  }

  static getSubscription () {
    navigator.serviceWorker.ready.then(registration => {
      if (!registration.active) {
        return;
      }
      return registration.pushManager.getSubscription();
    });
  }

  async subscribe () {
    if (this.subscribing) {
      return;
    }

    // no permission ? bail.
    const permission = await Notification.requestPermission();
    if (permission === 'denied') {
      return;
    }

    // already subscribed ? bail.
    const subscription = await Pusher.getSubscription();
    if (subscription) {
      return;
    }

    this.subscribing = true;

    // if no key, get key
    if (!this.key) {
      this.init();
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
      return;
    }

    // subscribe the user with the vapid key
    const result = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(this.key)
    });

    const response = await fetch(`${Constants.API_URL}/push/subscribe`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      },
      body: JSON.stringify(result)
    });

    if (response.status === 500) {
      store.dispatch(toasting(['Error when subscribing...'], ['dismiss'], 5000));
    }

    if (response.status === 200) {
      store.dispatch(toasting(['Subscribed'], ['dismiss'], 3000));
    }

    this.subscribing = false;
  }

  async unsubscribe () {
    if (this.unsubscribing) {
      return;
    }

    // not subscribed ? bail.
    const subscription = await Pusher.getSubscription();
    console.log(subscription);
    if (!subscription) return;

    this.unsubscribing = true;
    await subscription.unsubscribe();

    console.log('unsubscribed', subscription);

    const response = fetch(`${Constants.API_URL}/push/unsubscribe`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      },
      body: JSON.stringify({
        endpoint: subscription.toJSON().endpoint
      })
    });

    if (response.status === 200) {
      store.dispatch(toasting(['Unsubscribed'], ['dismiss'], 3000));
    }

    this.unsubscribing = false;
  }
}

export default Pusher;
