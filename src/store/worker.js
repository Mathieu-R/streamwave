import createStore from 'stockroom/worker';
import idbKeyVal from 'idb-keyval';
import Constants from '../constants';

const store = createStore({
  user: {
    userId: '',
    email: '',
    avatar: ''
  },
  toast: {
    messages: [],
    show: false
  }
});

// globally available actions
store.registerActions(store => ({
  toast ({toast}) {
    return {
      toast: {
        messages: toast.messages,
        show: true
      }
    };
  },

  async register ({user}, email, password) {
    const response = await fetch(`${Constants.AUTH_URL}/local/register`, {
      method: 'POST',
      body: JSON.stringify({
        email, password
      })
    });

    const data = await response.json();

    // bad typing, password not strong enough or email already used
    if (response.status === 400) {
      // data.error
    }

    // server error
    if (response.status === 500) {
      // data.error
    }

    // user created, mail sent
    // data.message
  },

  async login ({user}, email, password) {
    const response = await fetch(`${Constants.AUTH_URL}/local/login`, {
      method: 'POST',
      body: JSON.stringify({
        email, password
      })
    });

    const data = await response.json();

    // bad typing
    if (response.status === 400) {
      // data.error
    }

    // user does not exist
    if (response.status === 204) {

    }
    login
    // server error
    if (response.status === 500) {
      // data.error
    }

    // user logged, token received
    // should save it into idb since localStore
    // is unavailable in web workers
  },

  async getResetToken (state, email) {
    const response = await fetch(`${Constants.AUTH_URL}/local/get-reset-token`, {
      method: 'POST',
      body: JSON.stringify({
        email
      })
    });

    // email does not exist
    if (response.status === 204) {

    }

    // reset account failed
    if (response.status === 500) {

    }

    const data = await response.json();


    // email sent, check it to change your password
    // NOTE: should change from success to message in api response
  },

  async changePassword (state, password, token) {
    const response = await fetch(`${Constants.AUTH_URL}/local/reset-password?token=${token}`, {
      method: 'POST',
      body: JSON.stringify({
        password
      })
    });

    // server error
    if (response.status === 500) {

    }

    const data = await response.json();

    // token invalid or expired
    if (response.status === 400) {
      // data.error
    }

    // password changed
    // data.message
  }
}));
