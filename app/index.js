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

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    // eslint-disable-next-line default-case
    switch (event.key) {
      case '/':
        history.push('/');
        event.preventDefault();
        break;
      case 'n':
        history.push('/links/add');
        event.preventDefault();
        break;
    }
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
