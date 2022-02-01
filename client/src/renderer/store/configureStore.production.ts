import { applyMiddleware, createStore } from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';
import thunk from 'redux-thunk';
import middlewares from '../middleware';
import createRootReducer from '../reducers';

let createHistory;
if (process.env.TARGET === 'web') {
  createHistory = require('history').createBrowserHistory;
} else {
  createHistory = require('history').createHashHistory;
}
const { routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createHistory(),
});
const enhancer = applyMiddleware(thunk, routerMiddleware, ...middlewares);

function configureStore(initialState = undefined) {
  return createStore(createRootReducer(routerReducer), initialState, enhancer);
}

export default { configureStore, history };
