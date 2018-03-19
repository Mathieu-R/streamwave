import { getConfiguredCache } from 'money-clip';
import Constants from '../constants';

const cache = getConfiguredCache({
  version: Constants.VERSION,
  maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
});

export default cache;
