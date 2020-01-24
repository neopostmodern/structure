// @flow

import {
  REQUEST_LOGIN,
  completeLogin,
  requestLogin,
  REQUEST_CLIPBOARD, setClipboard
} from '../actions/userInterface';
import { REQUEST_RESTART } from '../actions/configuration';

let electronMiddleware;

if (process.env.TARGET === 'web') {
  electronMiddleware = store => next => action => {
    if (action.type === REQUEST_LOGIN) {
      window.location = `${BACKEND_URL}/login/github`;
    }
    if (action.type === REQUEST_CLIPBOARD) {
      navigator.permissions.query({ name: 'clipboard-read' })
        .then(({ state }) => {
          if (state === 'granted') {
            navigator.clipboard.readText()
              .then(clipboardContent => {
                next(setClipboard(clipboardContent));
              })
              .catch(error => {
                console.error('[Clipboard] Failed to read clipboard', error);
              });
          }
        })
        .catch(error => {
          console.error('[Clipboard] Failed to check clipboard permissions', error);
        });
    }
    if (action.type === REQUEST_RESTART) {
      window.location.reload();
    }
    return next(action);
  };
} else {
  const { ipcRenderer } = require('electron');
  electronMiddleware = store => {
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
}

export default electronMiddleware;
