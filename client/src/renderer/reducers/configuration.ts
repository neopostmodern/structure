import { NetworkMode, SET_NETWORK_MODE } from '../actions/configuration';

export interface ConfigurationStateType {
  backendUrl: string;
  backendUrlDefault: string;
  networkMode: NetworkMode;
}

type Action = { type: string; payload?: any };

let backendUrl;
let networkMode;
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL;
  networkMode =
    (localStorage.getItem('network-mode') as NetworkMode) || NetworkMode.AUTO;
} else {
  backendUrl = window.electron.electronStore.get('backend-url', BACKEND_URL);
  networkMode = window.electron.electronStore.get(
    'network-mode',
    NetworkMode.AUTO
  );
}

const initialState: ConfigurationStateType = {
  backendUrl,
  backendUrlDefault: BACKEND_URL,
  networkMode,
};

export default function configuration(
  state: ConfigurationStateType = initialState,
  action: Action
) {
  switch (action.type) {
    case SET_NETWORK_MODE:
      return { ...state, networkMode: action.payload };
    default:
      return state;
  }
}
