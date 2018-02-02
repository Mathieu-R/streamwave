import createStore from 'stockroom/worker';

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
  toastMessage (messages) {
    return {
      toast: {messages, show: true}
    };
  }
}));
