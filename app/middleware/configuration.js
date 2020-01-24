// @flow

import { requestRestart, SET_BACKEND_URL } from '../actions/configuration';

let configurationMiddleware;

if (process.env.TARGET !== 'web') {
  const ElectronStore = require('electron-store');
  const electronStore = new ElectronStore();

  configurationMiddleware = store => next => action => {
    if (action.type === SET_BACKEND_URL) {
      electronStore.set('backend-url', action.payload);
      store.dispatch(requestRestart());
    }
    return next(action);
  };
} else {
  // eslint-disable-next-line no-unused-vars
  configurationMiddleware = store => next => action => next(action); // no-op middleware
}

export default configurationMiddleware;
