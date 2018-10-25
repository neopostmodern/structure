// @flow

import {
  REQUEST_LOGIN,
  completeLogin,
  requestLogin,
  REQUEST_CLIPBOARD, setClipboard
} from '../actions/userInterface';
import { ipcRenderer, clipboard } from 'electron';
import { REQUEST_RESTART } from '../actions/configuration';

export default store => {
  ipcRenderer.on('login-closed', () => {
    store.dispatch(completeLogin());
  });
  ipcRenderer.on('can-login', () => {
    store.dispatch(requestLogin());
  });

  return next => action => {
    if (action.type === REQUEST_LOGIN) {
      ipcRenderer.send('login-modal', store.getState().configuration.backendUrl);
    }
    if (action.type === REQUEST_CLIPBOARD) {
      next(setClipboard(clipboard.readText()));
    }
    if (action.type === REQUEST_RESTART) {
      ipcRenderer.send('restart');
    }
    return next(action);
  };
};
