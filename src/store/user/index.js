// types
const STORE_USER = 'STORE_USER';

// actions
export function storeUser (user) {
  type: STORE_USER,
  user
}

// reducers
export default (state = {}, action) => {
  const {type, user} = action;
  switch (type) {
    case STORE_USER:
      return {
        ...user
      }
    default:
      return state;
  }
}
