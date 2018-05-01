import { set, get } from 'idb-keyval';

class SettingsManager {
  constructor () {

  }

  static get IDB_KEY () {
    return 'streamwave-settings';
  }

  async init () {
    let settings = await get(SettingsManager.IDB_KEY);
    if (settings) {
      return;
    }

    settings = {};

    settings['fade'] = 0;
    settings['equalize-volume'] = false;
    settings['equalizer'] = 'none';
    settings['download-quality'] = 256;
    settings['limit-data'] = false;
    settings['data-max'] = 0;

    return set(SettingsManager.IDB_KEY, settings);
  }

  getAll () {
    return get(SettingsManager.IDB_KEY);
  }

  async get (key) {
    const settings = await get(SettingsManager.IDB_KEY);
    return settings[key];
  }

  async set (key, value) {
    const settings = await get(SettingsManager.IDB_KEY);
    settings[key] = value;
    return set(SettingsManager.IDB_KEY, settings);
  }
}

export default SettingsManager;
