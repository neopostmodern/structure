import Mousetrap from 'mousetrap';
import { createRoot } from 'react-dom/client';
import apolloClient from './apollo';
import ErrorBoundary from './components/ErrorBoundary';
import { history, store } from './configureStore';
import Root from './containers/Root';
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

const root = createRoot(document.getElementById('root')!);

root.render(
  <ErrorBoundary>
    <Root store={store} history={history} client={apolloClient} />
  </ErrorBoundary>
);
