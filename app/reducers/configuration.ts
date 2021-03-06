export interface ConfigurationStateType {
  backendUrl: string
  backendUrlDefault: string
}

type Action = { type: string; payload?: any }

let backendUrl
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL
} else {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const ElectronStore = require('electron-store')
  const electronStore = new ElectronStore()
  backendUrl = electronStore.get('backend-url', BACKEND_URL)
}

const initialState: ConfigurationStateType = {
  backendUrl,
  backendUrlDefault: BACKEND_URL,
}

export default function configuration(
  state: ConfigurationStateType = initialState,
  action: Action,
) {
  switch (action.type) {
    default:
      return state
  }
}
