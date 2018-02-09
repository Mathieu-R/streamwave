import createStore from 'stockroom/worker';
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
  toasting (state, messages, duration = 3000) {
    store.setState({
      toast: {
        messages,
        show: true
      }
    });
    setTimeout(() => store.setState({toast: {show: false}}, duration));
  },

  storeUser (state, user) {
    return {
      user
    }
  }
}));
