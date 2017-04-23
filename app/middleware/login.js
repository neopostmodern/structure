//@flow
import { REQUEST_LOGIN, completeLogin } from '../actions/userInterface';
import { ipcRenderer } from 'electron';

export default store => {
  ipcRenderer.on('login-closed', () => {
    store.dispatch(completeLogin());
  });
  
  return next => action => {
    if (action.type == REQUEST_LOGIN) {
      ipcRenderer.send('login-modal', true);
    }
    // console.log('next state', store.getState())
    return next(action)
  }
}
