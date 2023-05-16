import { ApolloClient, ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { type History } from 'history';
import React, { lazy, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Store } from 'redux';
import { CURRENT_MIGRATION_VERSION } from '../migrations/migrations';
import migrationSystem, {
  getMigrationStorageVersionSync,
} from '../migrations/migrationSystem';
import { RootState } from '../reducers';
import useTheme from '../styles/useTheme';
import suspenseWrap from '../utils/suspenseWrap';
import AuthWrapper from './AuthWrapper';
import ComplexLayout from './ComplexLayout';
import NotesPage from './NotesPage';

const wrap = (LazyComponent: React.LazyExoticComponent<React.FC<{}>>) =>
  suspenseWrap(LazyComponent, () => <ComplexLayout loading />);

const AddNotePage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './AddNotePage'))
);
const LinkPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './LinkPage'))
);
const MissingPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './MissingPage'))
);
const SettingsPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './SettingsPage'))
);
const TagPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './TagPage'))
);
const TagsPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './TagsPage'))
);
const TextPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './TextPage'))
);
const UserPage = wrap(
  lazy(() => import(/* webpackPrefetch: true */ './UserPage'))
);

type RootType = {
  store: Store<RootState>;
  history: History;
  client: ApolloClient<any>;
};

const Root: React.FC<RootType> = ({ store, history, client }) => {
  const theme = useTheme();
  const [isMigrationsFinished, setIsMigrationFinished] = useState(
    getMigrationStorageVersionSync() !== CURRENT_MIGRATION_VERSION
  );
  useEffect(() => {
    if (isMigrationsFinished) {
      return;
    }

    (async () => {
      await migrationSystem.migrateTo(CURRENT_MIGRATION_VERSION);
      setIsMigrationFinished(true);
    })();
  }, [isMigrationsFinished]);

  if (!isMigrationsFinished) {
    return null;
  }

  useEffect(() => {
    // this effect runs after the first full render
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.opacity = '0';
      setTimeout(() => loadingElement.remove(), 300);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <AuthWrapper>
              <Routes>
                <Route path="/" element={<NotesPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/notes/add" element={<AddNotePage />} />
                <Route path="/texts/:textId" element={<TextPage />} />
                <Route path="/links/:linkId" element={<LinkPage />} />

                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/me" element={<UserPage />} />

                <Route path="/tags" element={<TagsPage />} />
                <Route path="/tags/:tagId" element={<TagPage />} />

                <Route path="*" element={<MissingPage />} />
              </Routes>
            </AuthWrapper>
          </ThemeProvider>
        </HistoryRouter>
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
