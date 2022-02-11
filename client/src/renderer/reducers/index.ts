import { combineReducers, Reducer } from 'redux';
import { RouterState } from 'redux-first-history';
import configuration from './configuration';
import history from './history';
import userInterface from './userInterface';

const createRootReducer = (routerReducer: Reducer<RouterState>) =>
  combineReducers({
    router: routerReducer,
    userInterface,
    configuration,
    history,
  });

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;

export default createRootReducer;
