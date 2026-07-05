import browser from 'webextension-polyfill'
import { EXTENSION_TOKEN_STORAGE_KEY } from './constants'

export const getStoredToken = async (): Promise<string | undefined> => {
  const stored = await browser.storage.local.get(EXTENSION_TOKEN_STORAGE_KEY)
  return stored[EXTENSION_TOKEN_STORAGE_KEY] as string | undefined
}

export const clearStoredToken = async (): Promise<void> => {
  await browser.storage.local.remove(EXTENSION_TOKEN_STORAGE_KEY)
}

// This must run in the background script, not the popup: the interactive
// GitHub window steals focus, which closes the action popup (by browser
// design, popups close when they lose focus) well before the OAuth flow
// completes. Anything that needs to survive to see the result - storing the
// token - has to happen outside the popup's own, short-lived page. See
// background.ts, which is the only thing that calls this.
export const logInWithGitHub = async (): Promise<string> => {
  const redirectUri = browser.identity.getRedirectURL()
  const authUrl = `${__BACKEND_URL__}/login/github/extension?redirect_uri=${encodeURIComponent(redirectUri)}`

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  })

  if (!responseUrl) {
    throw new Error('GitHub login was cancelled or failed.')
  }

  const fragment = new URL(responseUrl).hash.replace(/^#/, '')
  const token = new URLSearchParams(fragment).get('token')

  if (!token) {
    throw new Error('GitHub login did not return a token.')
  }

  await browser.storage.local.set({ [EXTENSION_TOKEN_STORAGE_KEY]: token })
  return token
}
