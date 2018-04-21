// types
const TOAST_MESSAGE = 'TOAST_MESSAGE';
const STOP_TOAST = 'STOP_TOAST';

// actions
export function postToastMessage (messages) {
  return {
    type: TOAST_MESSAGE,
    messages
  }
}

export function stopToastMessage () {
  return {
    type: STOP_TOAST
  }
}

export function toasting (messages, duration = 3000) {
  return (dispatch) => {
    dispatch(postToastMessage(messages, duration));
    setTimeout(() => dispatch(stopToastMessage()), duration)
  }
}

// selectors
export const getMessages = state => state.toast.messages;
export const toShow = state => state.toast.show;

// reducers
export default (state = {}, action) => {
  const {type, messages} = action;
  switch (type) {
    case TOAST_MESSAGE:
      return {
        ...state,
        messages: [...messages],
        show: true
      }
    case STOP_TOAST:
      return {
        ...state,
        //messages: [],
        show: false
      }
    default:
      return state;
  }
}
