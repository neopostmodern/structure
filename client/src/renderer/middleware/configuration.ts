import { Middleware } from 'redux'
import { SET_LOG_LEVEL } from '../actions/configuration'
import { RootState } from '../reducers'
import logger from '../utils/logger'

const persistenceMiddleware: Middleware<{}, RootState> =
  () => (next) => (action) => {
    if (action.type === SET_LOG_LEVEL) {
      logger.setLevel(action.payload)
    }
    return next(action)
  }
export default persistenceMiddleware
