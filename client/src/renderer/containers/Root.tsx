import { ApolloClient, ApolloProvider } from '@apollo/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { type History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Store } from 'redux';
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

type RootType = {
  store: Store<RootState>;
  history: History;
  client: ApolloClient<any>;
};

const Root: React.FC<RootType> = ({ store, history, client }) => {
  const theme = useTheme();

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

                <Route path="/me" element={<SettingsPage />} />

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
