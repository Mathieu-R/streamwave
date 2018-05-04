import SettingsManager from '../../utils/settings-manager';
const manager = new SettingsManager();

// types
const RESTORE_SETTINGS = 'RESTORE_SETTINGS';
const SET_FADE = 'SET_FADE';
const SET_EQUALIZE_VOLUME = 'SET_EQUALIZE_VOLUME';
const SET_EQUALIZER = 'SET_EQUALIZER';
const SET_DOWNLOAD_WITH_MOBILE_NETWORK = 'SET_DOWNLOAD_WITH_MOBILE_NETWORK';
const SET_DOWNLOAD_QUALITY = 'SET_DOWNLOAD_QUALITY';
const SET_LIMIT_DATA_STATUS = 'SET_LIMIT_DATA_STATUS';
const SET_DATA_VOLUME_MAX = 'SET_DATA_VOLUME_MAX';

export function restoreSettings () {
  return dispatch => {
    manager.init()
      .then(_ => manager.getAll())
      .then(settings => {
        console.log(settings);
        dispatch({
          type: RESTORE_SETTINGS,
          settings
        });
      });
  }
}

// actions
export function setFade (value) {
  return dispatch => {
    manager.set('fade', value).then(_ => {
      dispatch({
        type: SET_FADE,
        value
      });
    });
  }
}

export function setEqualizeVolume (status) {
  return dispatch => {
    manager.set('equalize-volume', status).then(_ => {
      dispatch({
        type: SET_EQUALIZE_VOLUME,
        status
      });
    });
  }
}

export function setEqualizer (eq) {
  return dispatch => {
    manager.set('equalizer', eq).then(_ => {
      dispatch({
        type: SET_EQUALIZER,
        eq
      });
    });
  }
}

export function setDownloadWithMobileNetwork (status) {
  return dispatch => {
    manager.set('download-mobile-network', status).then(_ => {
      dispatch({
        type: SET_DOWNLOAD_WITH_MOBILE_NETWORK,
        status
      })
    });
  }
}

export function setDownloadQuality (quality) {
  return dispatch => {
    manager.set('download-quality', quality).then(_ => {
      dispatch({
        type: SET_DOWNLOAD_QUALITY,
        quality
      });
    });
  }
}

export function setLimitDataStatus (status) {
  return dispatch => {
    manager.set('limit-data', status).then(_ => {
      dispatch({
        type: SET_LIMIT_DATA_STATUS,
        status
      })
    })
  }
}

export function setMaxDataVolume (value) {
  return dispatch => {
    manager.set('data-max', value).then(_ => {
      dispatch({
        type: SET_DATA_VOLUME_MAX,
        value
      });
    });
  }
}

// selectors
export const getFade = state => state.settings.fade;
export const getEqualizeVolume = state => state.settings.equalizeVolume;
export const getEq = state => state.settings.eq;
export const getQuality = state => state.settings.downloadQuality;
export const getDownloadWithMobileNetwork = state => state.settings.downloadWithMobileNetwork;
export const getLimitDataStatus = state => state.settings.limitData;
export const getDataMax = state => state.settings.dataMax;

// reducers

export default (state = {}, action) => {
  const {type} = action;
  switch (type) {
    case RESTORE_SETTINGS:
      return {
        ...state,
        fade: action.settings['fade'],
        equalizeVolume: action.settings['equalize-volume'],
        eq: action.settings['equalizer'],
        downloadWithMobileNetwork: action.settings['download-mobile-network'],
        downloadQuality: action.settings['download-quality'],
        limitData: action.settings['limit-data'],
        dataMax: action.settings['data-max']
      }

    case SET_FADE:
      return {
        ...state,
        fade: action.value
      }

    case SET_EQUALIZE_VOLUME:
      return {
        ...state,
        equalizeVolume: action.status
      }

    case SET_EQUALIZER:
      return {
        ...state,
        eq: action.eq
      }

    case SET_DOWNLOAD_WITH_MOBILE_NETWORK:
      return {
        ...state,
        downloadWithMobileNetwork: action.status
      }

    case SET_DOWNLOAD_QUALITY:
      return {
        ...state,
        downloadQuality: action.quality
      }

    case SET_LIMIT_DATA_STATUS:
      return {
        ...state,
        limitData: action.status
      }

    case SET_DATA_VOLUME_MAX:
      return {
        ...state,
        dataMax: action.value
      }

    default:
      return state;
  }
}
