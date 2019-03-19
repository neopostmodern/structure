// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';

import links from './links';
import userInterface from './userInterface';
import configuration from './configuration';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  form,
  links,
  userInterface,
  configuration,
});

export default createRootReducer;
