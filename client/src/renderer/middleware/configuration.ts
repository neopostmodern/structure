import {
  requestRestart,
  SET_BACKEND_URL,
  SET_NETWORK_MODE,
} from '../actions/configuration';

const configurationMiddleware = (store) => (next) => (action) => {
  if (process.env.TARGET !== 'web') {
    if (action.type === SET_BACKEND_URL) {
      localStorage.setItem('backend-url', action.payload);
      store.dispatch(requestRestart());
    }
  }
  if (action.type === SET_NETWORK_MODE) {
    localStorage.setItem('network-mode', action.payload);
  }
  return next(action);
};

export default configurationMiddleware;
