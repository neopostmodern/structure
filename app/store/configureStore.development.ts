import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware, push } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import createRootReducer from '../reducers'
import middlewares from '../middleware'

let createHistory
if (process.env.TARGET === 'web') {
  createHistory = require('history').createBrowserHistory
} else {
  createHistory = require('history').createHashHistory
}
const history = createHistory()

const configureStore = (initialState) => {
  // Redux Configuration
  const middleware = [...middlewares]
  const enhancers = []

  // Thunk Middleware
  middleware.push(thunk)

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  })
  middleware.push(logger)

  // Router Middleware
  const router = routerMiddleware(history)
  middleware.push(router)

  // Redux DevTools Configuration
  const actionCreators = {
    push,
  }
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
      })
    : compose
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware))
  // todo: const enhancer = composeEnhancers(...enhancers);
  const enhancer = composeEnhancers(...enhancers)

  // Create Store
  const store = createStore(createRootReducer(history), initialState, enhancer)

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      () => store.replaceReducer(require('../reducers')), // eslint-disable-line global-require
    )
  }

  return store
}

export default { configureStore, history }
