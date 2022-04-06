import { push } from 'redux-first-history';
import { REQUEST_RESTART } from '../actions/configuration';
import {
  completeLogin,
  requestLogin,
  REQUEST_CLIPBOARD,
  REQUEST_LOGIN,
  REQUEST_LOGOUT,
  setClipboard,
} from '../actions/userInterface';

const handleLogin = (backendUrl: string, popUpOptions: string, dispatch) => {
  const loginPopup = window.open(
    `${backendUrl}/login/github`,
    'Log in with GitHub',
    popUpOptions
  );
  const onCloseWatcher = setInterval(() => {
    if (loginPopup.closed) {
      dispatch(completeLogin());
      clearInterval(onCloseWatcher);
    }
  }, 100);
};

let electronMiddleware;

if (process.env.TARGET === 'web') {
  electronMiddleware = (store) => (next) => (action) => {
    if (action.type === REQUEST_LOGIN) {
      handleLogin(
        BACKEND_URL,
        'height=600,width=400,modal=yes,alwaysRaised=yes',
        store.dispatch
      );
    }
    if (action.type === REQUEST_LOGOUT) {
      store.dispatch(push(`${BACKEND_URL}/logout`));
    }
    if (action.type === REQUEST_CLIPBOARD) {
      navigator.permissions
        .query({ name: 'clipboard-read' as any })
        .then(({ state }) => {
          if (state === 'granted') {
            navigator.clipboard
              .readText()
              .then((clipboardContent) => {
                next(setClipboard(clipboardContent));
              })
              .catch((error) => {
                console.error('[Clipboard] Failed to read clipboard', error);
              });
          }
        })
        .catch((error) => {
          console.error(
            '[Clipboard] Failed to check clipboard permissions',
            error
          );
        });
    }
    if (action.type === REQUEST_RESTART) {
      window.location.reload();
    }
    return next(action);
  };
} else {
  const { ipcRenderer, clipboard } = window.electron;
  electronMiddleware = (store) => {
    ipcRenderer.on('navigate', (path) => {
      store.dispatch(push(path));
    });
    ipcRenderer.on('login-closed', () => {
      store.dispatch(completeLogin());
    });
    ipcRenderer.on('can-login', () => {
      store.dispatch(requestLogin());
    });

    return (next) => (action) => {
      if (action.type === REQUEST_LOGIN) {
        handleLogin(
          store.getState().configuration.backendUrl,
          'nodeIntegration=no',
          store.dispatch
        );
      }
      if (action.type === REQUEST_LOGOUT) {
        const logoutPopup = window.open(
          `${store.getState().configuration.backendUrl}/logout`,
          'Log out',
          'nodeIntegration=no'
        );
        const onCloseWatcher = setInterval(() => {
          if (logoutPopup?.closed) {
            store.dispatch(completeLogin());
            clearInterval(onCloseWatcher);
          }
        }, 100);
      }
      if (action.type === REQUEST_CLIPBOARD) {
        next(setClipboard(clipboard.readText()));
      }
      if (action.type === REQUEST_RESTART) {
        ipcRenderer.restart();
      }
      return next(action);
    };
  };
}

export default electronMiddleware;
