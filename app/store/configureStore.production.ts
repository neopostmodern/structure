import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from '../reducers'
import middlewares from '../middleware'

let createHistory
if (process.env.TARGET === 'web') {
  createHistory = require('history').createBrowserHistory
} else {
  createHistory = require('history').createHashHistory
}
const history = createHistory()
const router = routerMiddleware(history)
const enhancer = applyMiddleware(thunk, router, ...middlewares)

function configureStore(initialState) {
  return createStore(createRootReducer(history), initialState, enhancer)
}

export default { configureStore, history }
