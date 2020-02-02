/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

import Layout from './components/Layout';
import NotesPage from './containers/NotesPage';
import LinkPage from './containers/LinkPage';
import TextPage from './containers/TextPage';
import AddNotePage from './containers/AddNotePage';
import UserPage from './containers/UserPage';
import TagsPage from './containers/TagsPage';
import TagPage from './containers/TagPage';
import MissingPage from './containers/MissingPage';

export default () => (
  <Layout>
    <Switch>
      <Route path="/" exact component={NotesPage} />
      <Route path="/notes" exact component={NotesPage} />
      <Route path="/notes/add" exact component={AddNotePage} />

      <Route path="/texts/:textId" exact component={TextPage} />
      <Route path="/links/:linkId" exact component={LinkPage} />

      <Route path="/me" exact component={UserPage} />

      <Route path="/tags" exact component={TagsPage} />
      <Route path="/tags/:tagId" exact component={TagPage} />

      <Route component={MissingPage} />
    </Switch>
  </Layout>
);
