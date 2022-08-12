import {
  requestRestart,
  SET_BACKEND_URL,
  SET_NETWORK_MODE,
} from '../actions/configuration';

let configurationMiddleware;

if (process.env.TARGET !== 'web') {
  configurationMiddleware = (store) => (next) => (action) => {
    if (action.type === SET_BACKEND_URL) {
      window.electron.electronStore.set('backend-url', action.payload);
      store.dispatch(requestRestart());
    }
    if (action.type === SET_NETWORK_MODE) {
      window.electron.electronStore.set('network-mode', action.payload);
    }
    return next(action);
  };
} else {
  configurationMiddleware = () => (next) => (action) => {
    if (action.type === SET_NETWORK_MODE) {
      localStorage.setItem('network-mode', action.payload);
    }
    return next(action);
  };
}

export default configurationMiddleware;
