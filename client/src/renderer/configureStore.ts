/* eslint-disable global-require */
import { applyMiddleware, compose, createStore } from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';
import thunk from 'redux-thunk';
import middlewares from './middleware';
import createRootReducer from './reducers';

let createHistory;
if (process.env.TARGET === 'web') {
  createHistory = require('history').createBrowserHistory;
} else {
  createHistory = require('history').createHashHistory;
}
const { routerMiddleware, routerReducer, createReduxHistory } =
  createReduxHistoryContext({
    history: createHistory(),
  });

// Redux Configuration
const middleware = [...middlewares];
const enhancers = [];

// Thunk Middleware
middleware.push(thunk);

if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

// Router Middleware
middleware.push(routerMiddleware);

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;
/* eslint-enable no-underscore-dangle */

// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middleware));
const enhancer = composeEnhancers(...enhancers);

// Create Store
export const store = createStore(
  createRootReducer(routerReducer),
  undefined,
  enhancer
);

if (module.hot) {
  module.hot.accept(
    './reducers',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    () => store.replaceReducer(require('./reducers'))
  );
}

export const history = createReduxHistory(store);
