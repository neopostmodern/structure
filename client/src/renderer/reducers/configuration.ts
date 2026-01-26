import {
  NetworkMode,
  SET_LOG_LEVEL,
  SET_NETWORK_MODE,
} from '../actions/configuration'
import { LogLevelNumber } from '../utils/logger'

export interface ConfigurationStateType {
  backendUrl: string
  backendUrlDefault: string
  networkMode: NetworkMode
  logLevel: LogLevelNumber
}

type Action = { type: string; payload?: any }

const backendUrl =
  __BUILD_TARGET__ === 'web'
    ? __BACKEND_URL__
    : localStorage.getItem('backend-url') || __BACKEND_URL__
const networkMode =
  (localStorage.getItem('network-mode') as NetworkMode) || NetworkMode.AUTO
const rawLogLevel = localStorage.getItem('log-level')
const logLevel =
  (rawLogLevel && (parseInt(rawLogLevel) as LogLevelNumber)) ||
  LogLevelNumber.ERROR

const initialState: ConfigurationStateType = {
  backendUrl,
  backendUrlDefault: __BACKEND_URL__,
  networkMode,
  logLevel,
}

export default function configuration(
  state: ConfigurationStateType = initialState,
  action: Action,
) {
  switch (action.type) {
    case SET_NETWORK_MODE:
      return { ...state, networkMode: action.payload }
    case SET_LOG_LEVEL:
      return { ...state, logLevel: action.payload }
    default:
      return state
  }
}
