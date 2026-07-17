import { useApolloClient, useQuery } from '@apollo/client/react'
import { FC } from 'react'

import type { TagsWithCountsQuery } from '../renderer/generated/graphql'
import { TAGS_WITH_COUNTS_QUERY } from '../renderer/utils/sharedQueriesAndFragments'
import useDataState, { DataState } from '../renderer/utils/useDataState'
import UserIdContext from '../renderer/utils/UserIdContext'
import useAuth from './hooks/useAuth'
import Popup from './Popup'
import PopupLayout from './PopupLayout'
import LoginScreen from './screens/LoginScreen'

const PopupTagCacheWarmup: FC = () => {
  const tagsQuery = useDataState(
    useQuery<TagsWithCountsQuery>(TAGS_WITH_COUNTS_QUERY),
  )

  if (tagsQuery.state !== DataState.DATA) {
    return (
      <PopupLayout
        loading
        loadingHint='Preparing extension (loading tag cache)...'
      />
    )
  }

  return <Popup />
}

const PopupAuthAndCacheWrapper: FC = () => {
  const auth = useAuth()
  const apolloClient = useApolloClient()

  if (auth.authState === 'checking' || auth.authState === 'loading-profile') {
    return <PopupLayout loading />
  }

  if (auth.authState === 'logged-out') {
    return (
      <LoginScreen
        loggingIn={auth.loggingIn}
        loginError={auth.loginError}
        onLogIn={auth.logIn}
      />
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasTagsCached = (apolloClient.cache as any).data.data.ROOT_QUERY?.tags
  // the clean way would be, but likely it has an overhead: apolloClient.cache.extract().ROOT_QUERY?.tags !== undefined

  if (!hasTagsCached) {
    return <PopupTagCacheWarmup />
  }

  return (
    <UserIdContext.Provider value={auth.userId}>
      <Popup />
    </UserIdContext.Provider>
  )
}

export default PopupAuthAndCacheWrapper
