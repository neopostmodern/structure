import browser from 'webextension-polyfill'
import { logInWithGitHub } from './auth'
import { LOG_IN_MESSAGE_TYPE } from './constants'

browser.runtime.onMessage.addListener((message: unknown) => {
  if (
    (message as { type?: string } | undefined)?.type === LOG_IN_MESSAGE_TYPE
  ) {
    return logInWithGitHub()
  }
  return undefined
})
