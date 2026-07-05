import { useQuery } from '@apollo/client/react'
import { useCallback, useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import packageJson from '../../../package.json'
import type {
  ProfileQuery,
  ProfileQueryVariables,
} from '../../renderer/generated/graphql'
import { PROFILE_QUERY } from '../../renderer/utils/sharedQueriesAndFragments'
import { clearStoredToken, getStoredToken } from '../auth'
import { LOG_IN_MESSAGE_TYPE } from '../constants'

export type AuthState = 'checking' | 'logged-out' | 'loading-profile' | 'ready'

// Owns the extension's whole notion of "am I logged in": checking storage
// for a token, fetching the profile that token resolves to (also used to
// detect a revoked/stale token), and the login flow itself.
const useAuth = () => {
  const [isCheckingToken, setIsCheckingToken] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<Error>()

  useEffect(() => {
    ;(async () => {
      setHasToken(Boolean(await getStoredToken()))
      setIsCheckingToken(false)
    })()
  }, [])

  const profileQuery = useQuery<ProfileQuery, ProfileQueryVariables>(
    PROFILE_QUERY,
    {
      skip: !hasToken,
      errorPolicy: 'all',
      variables: { currentVersion: packageJson.version },
    },
  )
  const userId = profileQuery.data?.currentUser?._id || ''
  const isLoggedIn = Boolean(userId)

  useEffect(() => {
    // the stored token can go stale (revoked in Settings, user deleted, ...).
    // Gate this on profileQuery.data actually having arrived - not on "not
    // loading" - because right when hasToken flips true, skip goes from
    // true to false and `loading` can still read stale/false for a render
    // before the request actually starts, which would otherwise wipe out a
    // token that was just set.
    if (hasToken && profileQuery.data && !isLoggedIn) {
      ;(async () => {
        await clearStoredToken()
        setHasToken(false)
      })()
    }
  }, [hasToken, profileQuery.data, isLoggedIn])

  const logIn = useCallback(() => {
    setIsLoggingIn(true)
    setLoginError(undefined)
    ;(async () => {
      try {
        // runs in background.ts: the interactive GitHub window steals focus
        // and closes this popup well before the flow completes, so the
        // background script stores the token itself - this reply only
        // arrives if the popup happens to still be open (e.g. GitHub already
        // had a valid session and no window ever needed to open)
        await browser.runtime.sendMessage({ type: LOG_IN_MESSAGE_TYPE })
        setHasToken(true)
      } catch (error) {
        setLoginError(error as Error)
      } finally {
        setIsLoggingIn(false)
      }
    })()
  }, [])

  let authState: AuthState
  if (isCheckingToken) {
    authState = 'checking'
  } else if (!hasToken) {
    authState = 'logged-out'
  } else if (profileQuery.loading) {
    authState = 'loading-profile'
  } else {
    authState = 'ready'
  }

  return { authState, userId, loggingIn: isLoggingIn, loginError, logIn }
}

export default useAuth
