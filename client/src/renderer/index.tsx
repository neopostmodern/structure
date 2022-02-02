import Mousetrap from 'mousetrap';
import { render } from 'react-dom';
import apolloClient from './apollo';
import Root from './containers/Root';
import { history, store } from './configureStore';
import './styles/fonts.global.css';
import makeMousetrapGlobal from './utils/mousetrapGlobal';

if (process.env.TARGET === 'web') {
  import('./serviceworker/register'); // registers service worker
}

makeMousetrapGlobal(Mousetrap);
Mousetrap.bindGlobal(['ctrl+.', 'command+.'], () => {
  history.push('/');
  return false;
});
Mousetrap.bind(['esc'], () => {
  history.push('/');
});
Mousetrap.bindGlobal(['ctrl+n', 'command+n'], () => {
  history.push('/notes/add');
});
if (process.env.TARGET !== 'web') {
  Mousetrap.bindGlobal(['f12', 'ctrl+shift+i'], () => {
    window.electron.ipcRenderer.toggleDevTools();
  });
}

render(
  <Root store={store} history={history} client={apolloClient} />,
  document.getElementById('root')
);
