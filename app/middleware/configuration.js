// @flow
import ElectronStore from 'electron-store';

import { requestRestart, SET_BACKEND_URL } from '../actions/configuration';

const electronStore = new ElectronStore();

export default store => next => action => {
  if (action.type === SET_BACKEND_URL) {
    electronStore.set('backend-url', action.payload);
    store.dispatch(requestRestart());
  }
  return next(action);
};
