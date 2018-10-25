// @flow
import ElectronStore from 'electron-store';

export type configurationStateType = {
  backendUrl: string,
  backendUrlDefault: string,
};

type Action = { type: string, payload?: any };


const electronStore = new ElectronStore();
const backendUrl = electronStore.get('backend-url', BACKEND_URL);

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
