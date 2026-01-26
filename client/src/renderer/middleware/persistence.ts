import {
  requestRestart,
  SET_BACKEND_URL,
  SET_LOG_LEVEL,
  SET_NETWORK_MODE,
} from '../actions/configuration'
import { ADD_NOTE_TO_HISTORY } from '../actions/history'
import { LAST_VISITED_NOTES_STORAGE_KEY } from '../reducers/history'

const persistenceMiddleware = (store) => (next) => (action) => {
  if (__BUILD_TARGET__ !== 'web') {
    if (action.type === SET_BACKEND_URL) {
      localStorage.setItem('backend-url', action.payload)
      store.dispatch(requestRestart())
    }
  }
  if (action.type === SET_NETWORK_MODE) {
    localStorage.setItem('network-mode', action.payload)
  }
  if (action.type === SET_LOG_LEVEL) {
    localStorage.setItem('log-level', action.payload)
  }
  const nextAction = next(action)

  if (action.type === ADD_NOTE_TO_HISTORY) {
    localStorage.setItem(
      LAST_VISITED_NOTES_STORAGE_KEY,
      JSON.stringify(store.getState().history.lastVisitedNotes),
    )
  }
  return nextAction
}

export default persistenceMiddleware
