import { createBrowserHistory, createHashHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { createReduxHistoryContext } from 'redux-first-history';
import middlewares from './middleware';
import createRootReducer from './reducers';

const configureStore = async () => {
  let createHistory =
    __BUILD_TARGET__ === 'web' ? createBrowserHistory : createHashHistory;

  const { routerMiddleware, routerReducer, createReduxHistory } =
    createReduxHistoryContext({
      history: createHistory(),
    });

  // Redux Configuration
  const middleware = [...middlewares];
  const enhancers = [];

  if (!import.meta.env.PROD) {
    const { createLogger } = await import('redux-logger');
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
  const store = createStore(
    createRootReducer(routerReducer),
    undefined,
    enhancer
  );

  const history = createReduxHistory(store);
  return { store, history };
};

export default configureStore;
