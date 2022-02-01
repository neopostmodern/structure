export const SET_BACKEND_URL = 'SET_BACKEND_URL';
export const REQUEST_RESTART = 'REQUEST_RESTART';

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
