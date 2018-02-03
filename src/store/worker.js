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
  toasting ({toast}, messages) {
    return {
      toast: {
        messages,
        show: true
      }
    };
  }
}));
