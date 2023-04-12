import { NetworkMode, SET_NETWORK_MODE } from '../actions/configuration';

export interface ConfigurationStateType {
  backendUrl: string;
  backendUrlDefault: string;
  networkMode: NetworkMode;
}

type Action = { type: string; payload?: any };

const backendUrl =
  process.env.TARGET === 'web'
    ? BACKEND_URL
    : localStorage.getItem('backend-url') || BACKEND_URL;
const networkMode =
  (localStorage.getItem('network-mode') as NetworkMode) || NetworkMode.AUTO;

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
