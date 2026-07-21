import { combineReducers, Reducer } from 'redux'
import { RouterState } from 'redux-first-history'
import configuration from './configuration'
import history from './history'
import userInterface from './userInterface'

const createRootReducer = <ExtraReducers extends Record<string, Reducer> = {}>(
  routerReducer: Reducer<RouterState>,
  extraReducers?: ExtraReducers,
) =>
  combineReducers({
    router: routerReducer,
    userInterface,
    configuration,
    history,
    ...extraReducers,
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>

export default createRootReducer
