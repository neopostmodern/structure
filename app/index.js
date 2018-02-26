import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import apolloClient from './apollo';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

if (process.env.TARGET !== 'web') {
  import('@exponent/electron-cookies')
    .then(ElectronCookies => {
      ElectronCookies.enable({
        origin: 'http://localhost:3010',
      });
    });

  import('electron')
    .then(({ ipcRenderer }) => {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'F12') {
          ipcRenderer.send('toggle-dev-tools');
        }
      });
    });
}


window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    // eslint-disable-next-line default-case
    switch (event.key) {
      case '/':
        history.push('/');
        event.preventDefault();
        break;
      case 'n':
        history.push('/notes/add');
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
