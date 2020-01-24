// @flow

export type configurationStateType = {
  backendUrl: string,
  backendUrlDefault: string
};

type Action = { type: string, payload?: any };

let backendUrl;
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL;
} else {
  // eslint-disable-next-line global-require
  const ElectronStore = require('electron-store');
  const electronStore = new ElectronStore();
  backendUrl = electronStore.get('backend-url', BACKEND_URL);
}

const initialState: configurationStateType = {
  backendUrl,
  backendUrlDefault: BACKEND_URL,
};

export default function configuration(state: configurationStateType = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
