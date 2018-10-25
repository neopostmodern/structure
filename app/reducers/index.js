// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import links from './links';
import userInterface from './userInterface';
import configuration from './configuration';

const rootReducer = combineReducers({
  router,
  form,
  links,
  userInterface,
  configuration,
});

export default rootReducer;
