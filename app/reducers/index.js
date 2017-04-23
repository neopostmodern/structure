// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import apolloClient from '../apollo';

import links from './links';
import userInterface from './userInterface';

const rootReducer = combineReducers({
  router,
  form,
  apollo: apolloClient.reducer(),
  links,
  userInterface,
});

export default rootReducer;
