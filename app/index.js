import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ElectronCookies from '@exponent/electron-cookies';
import { ipcRenderer } from 'electron';

import apolloClient from './apollo';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

ElectronCookies.enable({
  origin: 'http://localhost:3010',
});

ipcRenderer.on('global-shortcut', (event, shortcut) => {
  switch (shortcut) {
    case 'new':
      history.push('/links/add'); // todo: doesn't update UI
      break;
    default:
      console.log('Unhandled shortcut', shortcut);
  }
});


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
