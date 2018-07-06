// @flow
import {
  REQUEST_LOGIN,
  completeLogin,
  requestLogin,
  REQUEST_CLIPBOARD, setClipboard
} from '../actions/userInterface'
import { ipcRenderer, clipboard } from 'electron';

export default store => {
  ipcRenderer.on('login-closed', () => {
    store.dispatch(completeLogin());
  });
  ipcRenderer.on('can-login', () => {
    store.dispatch(requestLogin());
  });

  return next => action => {
    if (action.type === REQUEST_LOGIN) {
      ipcRenderer.send('login-modal', BACKEND_URL);
    }
    if (action.type === REQUEST_CLIPBOARD) {
      next(setClipboard(clipboard.readText()));
    }
    return next(action);
  };
};
