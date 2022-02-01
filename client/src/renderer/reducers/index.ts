import { combineReducers, Reducer } from 'redux';
import { RouterState } from 'redux-first-history';
import configuration, { ConfigurationStateType } from './configuration';
import userInterface, { UserInterfaceStateType } from './userInterface';

export interface RootState {
  configuration: ConfigurationStateType;
  userInterface: UserInterfaceStateType;
  router: RouterState;
}

const createRootReducer = (routerReducer: Reducer<RouterState>) =>
  combineReducers({
    router: routerReducer,
    userInterface,
    configuration,
  });

export default createRootReducer;
