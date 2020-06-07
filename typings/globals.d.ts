declare const BACKEND_URL: string
declare const VERSION: string

declare interface NodeModule {
  hot?: {
    accept: (modulePath: string, callback: () => void) => void
  }
}

declare interface Window {
  __APOLLO_CLIENT__?: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
}
