import { createRoot } from 'react-dom/client';
import apolloClient from './apollo';
import ErrorBoundary from './components/ErrorBoundary';
import { history, store } from './configureStore';
import Root from './containers/Root';
import './styles/fonts.global.css';
import { bindShortcut, SHORTCUTS } from './utils/keyboard';

if (process.env.TARGET === 'web') {
  import('./serviceworker/register'); // registers service worker
}

bindShortcut(SHORTCUTS.HOME_PAGE, () => {
  history.push('/');
  return false;
});
bindShortcut(SHORTCUTS.NEW_NOTE_PAGE, () => {
  history.push('/notes/add');
});
if (process.env.TARGET !== 'web') {
  bindShortcut(SHORTCUTS.DEV_TOOLS, () => {
    window.electron.ipcRenderer.toggleDevTools();
  });
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <ErrorBoundary>
    <Root store={store} history={history} client={apolloClient} />
  </ErrorBoundary>
);
