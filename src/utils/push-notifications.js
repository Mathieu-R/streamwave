import { get, set } from 'idb-keyval';
import { urlBase64ToUint8Array } from '../index';
import Constants from '../constants';
import store from '../store';

import {
  toasting
} from '../store/toast';
import { urlBase64ToUint8Array } from '.';

class Pusher {
  constructor () {
    this.subscribing = false;
    this.unsubscribing = false;
    this.key = null;
  }

  static get IDB_KEY () {
    return 'push-notification-key';
  }

  static init () {
    if (Notification.permission === 'denied') {
      return;
    }

    // get a push api subscription (vapid) key
    fetch(`${Constants.API_URL}/push`)
    .then(response => response.text())
    .then(key => {
      this.key = key;
      return key;
    })
    .then(key => get(Pusher.IDB_KEY))
    .then(key => {
      // if there's no key stored
      if (!key) {
        set(Pusher.IDB_KEY, key);
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

    this.subscribing = true;

    const permission = await Notification.requestPermission();
    if (!permission) {
      return;
    }

    // const subscription = await Pusher.getSubscription();
    // subscribe the user with the vapid key
    const result = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(this.key)
    });

    console.log('[PUSH]', result);

    const response = await fetch(`${Constants.API_URL}/push/subscribe`, {
      method: 'post',
      headers: {
        'content-type': 'application/json'
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

    this.unsubscribing = true;

    const subscription = await Pusher.getSubscription();
    await subscription.unsubscribe();

    const response = fetch(`${Constants.API_URL}/push/unsubscribe`, {
      method: 'post',
      headers: {
        'content-type': 'application/json'
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
