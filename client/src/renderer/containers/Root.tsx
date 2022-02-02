import { ApolloClient, ApolloProvider } from '@apollo/client';
import { type History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Store } from 'redux';
import { RootState } from '../reducers';
import AddNotePage from './AddNotePage';
import AuthWrapper from './AuthWrapper';
import LegacyLayout from './LegacyLayout';
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
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<NotesPage />} />
              <Route
                path="/notes"
                element={
                  <LegacyLayout>
                    <NotesPage />
                  </LegacyLayout>
                }
              />
              <Route path="/notes/add" element={<AddNotePage />} />

              <Route
                path="/texts/:textId"
                element={
                  <LegacyLayout>
                    <TextPage />
                  </LegacyLayout>
                }
              />
              <Route path="/links/:linkId" element={<LinkPage />} />

              <Route path="/me" element={<SettingsPage />} />

              <Route
                path="/tags"
                element={
                  <LegacyLayout>
                    <TagsPage />
                  </LegacyLayout>
                }
              />
              <Route
                path="/tags/:tagId"
                element={
                  <LegacyLayout>
                    <TagPage />
                  </LegacyLayout>
                }
              />

              <Route
                element={
                  <LegacyLayout>
                    <MissingPage />
                  </LegacyLayout>
                }
              />
            </Routes>
          </AuthWrapper>
        </HistoryRouter>
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
