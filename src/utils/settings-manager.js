import idb from '../utils/cache';

class SettingsManager {
  constructor () {

  }

  static get IDB_KEY () {
    return 'streamwave-settings';
  }

  async init () {
    let settings = await idb.get(SettingsManager.IDB_KEY);
    if (settings) {
      return;
    }

    settings = {};

    settings['fade'] = 0;
    settings['equalize-volume'] = false;
    settings['equalizer'] = false;
    settings['download-quality'] = 256;
    settings['data-max'] = false;

    return idb.set(SettingsManager.IDB_KEY, settings);
  }

  getAll () {
    return idb.get(SettingsManager.IDB_KEY);
  }

  async get (key) {
    const settings = await idb.get(SettingsManager.IDB_KEY);
    return settings[key];
  }

  async set (key, value) {
    const settings = await idb.get(SettingsManager.IDB_KEY);
    settings[key] = value;
    return idb.set(SettingsManager.IDB_KEY, settings);
  }
}

export default SettingsManager;
