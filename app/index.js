import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ElectronCookies from '@exponent/electron-cookies';
import { ipcRenderer } from 'electron';
import Mousetrap from 'mousetrap';
import makeMousetrapGlobal from './utils/mousetrapGlobal';

import apolloClient from './apollo';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

ElectronCookies.enable({
  origin: 'http://localhost:3010',
});


makeMousetrapGlobal(Mousetrap);
Mousetrap.bindGlobal(['esc', 'ctrl+/', 'command+/'], () => {
  history.push('/');
});
Mousetrap.bindGlobal(['ctrl+n', 'command+n'], () => {
  history.push('/notes/add');
});
Mousetrap.bindGlobal('F12', () => {
  ipcRenderer.send('toggle-dev-tools');
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
