import {
  ApolloClient,
  ApolloLink,
  gql,
  HttpLink,
  InMemoryCache,
  setLogVerbosity,
} from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { SetContextLink } from '@apollo/client/link/context'
import { LocalState } from '@apollo/client/local-state'
import type { CacheSizes } from '@apollo/client/utilities'
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist'
import localforage from 'localforage'

let backendUrl
if (__BUILD_TARGET__ === 'web' || __BUILD_TARGET__ === 'extension') {
  // no backend customization for web/extension, other backends should host their own frontends
  backendUrl = __BACKEND_URL__
} else {
  backendUrl = localStorage.getItem('backend-url') || __BACKEND_URL__

  if (backendUrl.endsWith('structure.neopostmodern.com')) {
    localStorage.setItem('backend-url', __BACKEND_URL__)
    backendUrl = __BACKEND_URL__
  }
}

const notesWithTagHelper = (
  cacheData: {
    [key: string]: {
      __typename: string
      _id: string
      tags?: Array<{ __ref: string }>
    }
  },
  tagId: string,
) =>
  Object.values(cacheData).filter(
    (cacheEntry) =>
      cacheEntry.__typename === 'Note' &&
      cacheEntry.tags!.some((tag) => tag.__ref === `Tag:${tagId}`),
  )

const cache = new InMemoryCache({
  typePolicies: {
    Tag: {
      fields: {
        notes: {
          read(currentValue, { variables: { tagId }, toReference }) {
            if (currentValue) {
              return currentValue
            }
            return notesWithTagHelper(cache.data.data, tagId).map(
              ({ __typename, _id }) => toReference({ __typename, _id }),
            )
          },
        },
      },
    },
    Query: {
      fields: {
        note(_, { args: { noteId }, toReference }) {
          return toReference({
            __typename: 'Note',
            id: noteId,
          })
        },
        tag(_, { args: { tagId }, toReference }) {
          return toReference({
            __typename: 'Tag',
            id: tagId,
          })
        },
      },
    },
  },
})

export const cachePersistor = new CachePersistor({
  cache,
  storage: new LocalForageWrapper(localforage),
  maxSize: false,
})

const httpLink = new HttpLink({
  uri: `${backendUrl}/graphql`,
  credentials: __BUILD_TARGET__ === 'extension' ? 'omit' : 'include',
})

// context link runs every time, so picks up a token added later automatically
const extensionAuthLink = new SetContextLink(async (prevContext) => {
  const { getStoredToken } = await import('../extension/auth') // can't import statically, relies on extension-specific globals
  const token = await getStoredToken()
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

const apolloOptions = {
  link:
    __BUILD_TARGET__ === 'extension'
      ? ApolloLink.from([extensionAuthLink, httpLink])
      : httpLink,
  // eslint-disable-next-line no-underscore-dangle
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: false,
  devTools: {
    enabled: import.meta.env.DEV || __DEBUG_PROD__ === 'true',
  },
}
export const apolloClient = new ApolloClient({
  ...apolloOptions,

  // required for @client
  // localState: new LocalState({}),
})

if (import.meta.env.DEV || __DEBUG_PROD__ === 'true') {
  loadDevMessages()
  loadErrorMessages()
  setLogVerbosity('debug')
}

const NOTES_LIST_SEED_QUERY = gql`
  query NotesListCacheSeed {
    notes {
      _id
    }
  }
`
const ensureExtensionNotesListFieldExists = () => {
  if (cache.readQuery({ query: NOTES_LIST_SEED_QUERY }) === null) {
    cache.writeQuery({ query: NOTES_LIST_SEED_QUERY, data: { notes: [] } })
  }
}

export const getApolloClient = async () => {
  await cachePersistor.restore()
  if (__BUILD_TARGET__ === 'extension') {
    ensureExtensionNotesListFieldExists()
  }
  return apolloClient
}
