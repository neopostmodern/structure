// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import links from './links';
import userInterface from './userInterface';

const rootReducer = combineReducers({
  router,
  links,
  userInterface,
});

export default rootReducer;
