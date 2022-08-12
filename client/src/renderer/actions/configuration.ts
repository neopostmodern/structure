export enum NetworkMode {
  AUTO = 'AUTO',
  FORCE_OFFLINE = 'FORCE_OFFLINE',
  FORCE_ONLINE = 'FORCE_ONLINE',
}

export const SET_BACKEND_URL = 'SET_BACKEND_URL';
export const REQUEST_RESTART = 'REQUEST_RESTART';
export const SET_NETWORK_MODE = 'SET_NETWORK_MODE';

export function setBackendUrl(backendUrl: string) {
  return {
    type: SET_BACKEND_URL,
    payload: backendUrl,
  };
}

export function requestRestart() {
  return {
    type: REQUEST_RESTART,
  };
}

export function setNetworkMode(networkMode: NetworkMode) {
  return {
    type: SET_NETWORK_MODE,
    payload: networkMode,
  };
}
