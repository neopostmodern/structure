import React from 'react'
import { Switch, Route } from 'react-router'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import Layout from '../components/Layout'
import NotesPage from './NotesPage'
import AddNotePage from './AddNotePage'
import TextPage from './TextPage'
import LinkPage from './LinkPage'
import UserPage from './UserPage'
import TagsPage from './TagsPage'
import TagPage from './TagPage'
import MissingPage from './MissingPage'

type RootType = {
  store: {}
  history: {}
  client: ApolloClient<any>
}

const Root: React.FC<RootType> = ({ store, history, client }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Layout>
            <Switch>
              <Route path='/' exact component={NotesPage} />
              <Route path='/notes' exact component={NotesPage} />
              <Route path='/notes/add' exact component={AddNotePage} />

              <Route path='/texts/:textId' exact component={TextPage} />
              <Route path='/links/:linkId' exact component={LinkPage} />

              <Route path='/me' exact component={UserPage} />

              <Route path='/tags' exact component={TagsPage} />
              <Route path='/tags/:tagId' exact component={TagPage} />

              <Route component={MissingPage} />
            </Switch>
          </Layout>
        </ConnectedRouter>
      </Provider>
    </ApolloProvider>
  )
}

export default Root
