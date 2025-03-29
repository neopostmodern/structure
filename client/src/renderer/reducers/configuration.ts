import { NetworkMode, SET_NETWORK_MODE } from '../actions/configuration';

export interface ConfigurationStateType {
  backendUrl: string;
  backendUrlDefault: string;
  networkMode: NetworkMode;
}

type Action = { type: string; payload?: any };

const backendUrl =
  __BUILD_TARGET__ === 'web'
    ? __BACKEND_URL__
    : localStorage.getItem('backend-url') || __BACKEND_URL__;
const networkMode =
  (localStorage.getItem('network-mode') as NetworkMode) || NetworkMode.AUTO;

const initialState: ConfigurationStateType = {
  backendUrl,
  backendUrlDefault: __BACKEND_URL__,
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
