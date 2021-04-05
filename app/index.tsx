import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Mousetrap from 'mousetrap'
import makeMousetrapGlobal from './utils/mousetrapGlobal'

import apolloClient from './apollo'
import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
import './styles/fonts.global.css'

import './serviceworker/register' // registers service worker

if (process.env.TARGET !== 'web') {
  import('@exponent/electron-cookies').then((ElectronCookies) => {
    ElectronCookies.enable({
      origin: 'http://localhost:3010',
    })
  })
}

makeMousetrapGlobal(Mousetrap)
Mousetrap.bindGlobal(['ctrl+.', 'command+.'], () => {
  history.push('/')
  return false
})
Mousetrap.bind(['esc'], () => {
  history.push('/')
})
Mousetrap.bindGlobal(['ctrl+n', 'command+n'], () => {
  history.push('/notes/add')
})
if (process.env.TARGET !== 'web') {
  import('electron').then(({ ipcRenderer }) => {
    Mousetrap.bindGlobal(['f12', 'ctrl+shift+i'], () => {
      ipcRenderer.send('toggle-dev-tools')
    })
  })
}

const store = configureStore()

render(
  <AppContainer>
    <Root store={store} history={history} client={apolloClient} />
  </AppContainer>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root') // eslint-disable-line global-require, @typescript-eslint/no-var-requires
    render(
      <AppContainer>
        <NextRoot store={store} history={history} client={apolloClient} />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
