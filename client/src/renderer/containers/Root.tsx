import { ApolloClient, ApolloProvider } from '@apollo/client';
import { type History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Store } from 'redux';
import Layout from '../components/Layout';
import { RootState } from '../reducers';
import AddNotePage from './AddNotePage';
import LinkPage from './LinkPage';
import MissingPage from './MissingPage';
import NotesPage from './NotesPage';
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
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <Layout>
            <Routes>
              <Route path="/" element={<NotesPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/add" element={<AddNotePage />} />

              <Route path="/texts/:textId" element={<TextPage />} />
              <Route path="/links/:linkId" element={<LinkPage />} />

              <Route path="/me" element={<UserPage />} />

              <Route path="/tags" element={<TagsPage />} />
              <Route path="/tags/:tagId" element={<TagPage />} />

              <Route element={<MissingPage />} />
            </Routes>
          </Layout>
        </HistoryRouter>
      </Provider>
    </ApolloProvider>
  );
};

export default Root;
