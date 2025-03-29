import { createRoot } from 'react-dom/client';
import { getApolloClient } from './apollo';
import ErrorBoundary from './components/ErrorBoundary';
import configureStore from './configureStore';
import Root from './containers/Root';
import './styles/fonts.global.css';
import { bindShortcut, SHORTCUTS } from './utils/keyboard';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

getApolloClient().then((apolloClient) => {
  configureStore().then(({ store, history }) => {
    bindShortcut(SHORTCUTS.HOME_PAGE, () => {
      history.push('/');
      return false;
    });
    bindShortcut(SHORTCUTS.SETTINGS_PAGE, () => {
      history.push('/settings');
      return false;
    });
    bindShortcut(SHORTCUTS.NEW_NOTE_PAGE, () => {
      history.push('/notes/add');
    });
    if (__BUILD_TARGET__ !== 'web') {
      bindShortcut(SHORTCUTS.DEV_TOOLS, () => {
        window.electron.ipcRenderer.toggleDevTools();
      });
    }

    rootElement.innerHTML = '';
    rootElement.classList.remove('loading');

    root.render(
      <ErrorBoundary>
        <Root store={store} history={history} client={apolloClient} />
      </ErrorBoundary>
    );
  });
});
