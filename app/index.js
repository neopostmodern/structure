import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ElectronCookies from '@exponent/electron-cookies';
import { ipcRenderer } from 'electron';

import apolloClient from './apollo';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

ElectronCookies.enable({
  origin: 'http://localhost:3010',
});

ipcRenderer.on('global-shortcut', (event, shortcut) => {
  switch (shortcut) {
    case 'home':
      history.push('/');
      break;
    default:
      console.log('Unhandled shortcut', shortcut);
  }
});

// hack because menu can't capture CTRL+/
window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === '/' && event.ctrlKey) {
    history.push('/');
    event.preventDefault();
  }
}, true);


const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} client={apolloClient} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} client={apolloClient} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
