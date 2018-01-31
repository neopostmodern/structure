// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import links from './links';
import userInterface from './userInterface';

const rootReducer = combineReducers({
  router,
  form,
  links,
  userInterface,
});

export default rootReducer;
