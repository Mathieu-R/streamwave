// types
const STORE_LIBRARY = 'STORE_LIBRARY';

// actions
export function storeLibrary (albums) {
  return {
    type: STORE_LIBRARY,
    albums
  }
}

// reducers
export default (state = [], action) => {
  const {type, albums} = action;
  switch (type) {
    case STORE_LIBRARY:
      return [
        ...state,
        ...albums
      ]
    default:
      return state;
  }
}
