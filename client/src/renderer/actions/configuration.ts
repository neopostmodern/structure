import { LogLevelNumber } from '../utils/logger'

export enum NetworkMode {
  AUTO = 'AUTO',
  FORCE_OFFLINE = 'FORCE_OFFLINE',
  FORCE_ONLINE = 'FORCE_ONLINE',
}

export const SET_BACKEND_URL = 'SET_BACKEND_URL'
export const REQUEST_RESTART = 'REQUEST_RESTART'
export const SET_NETWORK_MODE = 'SET_NETWORK_MODE'
export const SET_LOG_LEVEL = 'SET_LOG_LEVEL'

export function setBackendUrl(backendUrl: string) {
  return {
    type: SET_BACKEND_URL,
    payload: backendUrl,
  }
}

export function requestRestart() {
  return {
    type: REQUEST_RESTART,
  }
}

export function setNetworkMode(networkMode: NetworkMode) {
  return {
    type: SET_NETWORK_MODE,
    payload: networkMode,
  }
}

export function setLogLevel(logLevel: LogLevelNumber) {
  return {
    type: SET_LOG_LEVEL,
    payload: logLevel,
  }
}
