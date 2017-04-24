/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import Layout from './components/Layout';
import LinksPage from './containers/LinksPage';
import LinkPage from './containers/LinkPage';
import AddLinkPage from './containers/AddLinkPage';
import TagsPage from './containers/TagsPage';
import TagPage from './containers/TagPage';

export default () => (
  <Layout>
    <Router>
      <Switch>
        <Route path="/" exact component={LinksPage} />
        <Route path="/links" exact component={LinksPage} />
        <Route path="/links/add" exact component={AddLinkPage} />
        <Route path="/links/:linkId" exact component={LinkPage} />
        <Route path="/tags" exact component={TagsPage} />
        <Route path="/tags/:tagId" exact component={TagPage} />
      </Switch>
    </Router>
  </Layout>
);
