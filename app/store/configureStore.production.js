// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory as createHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import middlewares from '../middleware';


const history = createHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router, ...middlewares);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
