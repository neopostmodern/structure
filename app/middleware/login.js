// @flow
import { REQUEST_LOGIN, completeLogin, requestLogin } from '../actions/userInterface';

let loginMiddleware;

if (process.env.TARGET === 'web') {
  loginMiddleware = store => next => action => {
    if (action.type === REQUEST_LOGIN) {
      window.location = `${ BACKEND_URL }/login/github`;
    }
    return next(action);
  };
} else {
  import('electron')
    .then(({ipcRenderer}) => {
      loginMiddleware = store => {
        ipcRenderer.on('login-closed', () => {
          store.dispatch(completeLogin())
        })
        ipcRenderer.on('can-login', () => {
          store.dispatch(requestLogin())
        })

        return next => action => {
          if (action.type === REQUEST_LOGIN) {
            ipcRenderer.send('login-modal', BACKEND_URL)
          }
          return next(action)
        }
      }
    })
}

export default loginMiddleware;
