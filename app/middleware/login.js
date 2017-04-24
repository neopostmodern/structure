// @flow
import { REQUEST_LOGIN, completeLogin, requestLogin } from '../actions/userInterface';
import { ipcRenderer } from 'electron';

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
    return next(action);
  };
};
