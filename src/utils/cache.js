import { getConfiguredCache } from 'money-clip';
// import { get as getIdbKeyVal, set as setIdbKeyVal } from 'idb-keyval';
// import store from '../store';
import Constants from '../constants';

const cache = getConfiguredCache({
  version: Constants.VERSION,
  maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
});

// const userId = store.getState().user.id;

// export const get = key => getIdbKeyVal(`${key}_${userId}`);
// export const set = (key, item) => setIdbKeyVal(`${key}_${userId}`);

// export default cache;
