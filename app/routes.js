/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import Layout from './components/Layout';
import LinksPage from './containers/LinksPage';
import LinkPage from './containers/LinkPage';
import AddLinkPage from './containers/AddLinkPage';

export default () => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/links" exact component={LinksPage} />
        <Route path="/links/add" exact component={AddLinkPage} />
        <Route path="/links/:linkId" exact component={LinkPage} />
        <Route path="/" exact component={LinksPage} />
      </Switch>
    </Layout>
  </Router>
);
