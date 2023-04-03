import { ApolloClient, ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { type History } from 'history';
import React, { useEffect, useState } from 'react';
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
import AddNotePage from './AddNotePage';
import AuthWrapper from './AuthWrapper';
import LinkPage from './LinkPage';
import MissingPage from './MissingPage';
import NotesPage from './NotesPage';
import SettingsPage from './SettingsPage';
import TagPage from './TagPage';
import TagsPage from './TagsPage';
import TextPage from './TextPage';
import UserPage from './UserPage';

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
