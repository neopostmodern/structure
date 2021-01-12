import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'

import userInterface, { UserInterfaceStateType } from './userInterface'
import configuration, { ConfigurationStateType } from './configuration'

export interface RootState {
  configuration: ConfigurationStateType
  userInterface: UserInterfaceStateType
  router: RouterState
}

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    userInterface,
    configuration,
  })

export default createRootReducer
