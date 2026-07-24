import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useSelector } from 'react-redux'
import { Store } from 'redux'
import { getApolloClient } from '../renderer/apollo'
import ErrorBoundary from '../renderer/components/ErrorBoundary'
import configureStore from '../renderer/configureStore'
import '../renderer/styles/fonts.global.css'
import useTheme from '../renderer/styles/useTheme'
import PopupAuthAndCacheWrapper from './PopupAuthAndCacheWrapper'
import settings from './reducers/settings'
import SettingsScreen from './screens/SettingsScreen'
import { ExtensionRootState } from './store'

const PopupRoot: FC = () => {
  const settingsOpen = useSelector<ExtensionRootState, boolean>(
    (state) => state.settings.open,
  )

  return settingsOpen ? <SettingsScreen /> : <PopupAuthAndCacheWrapper />
}

const PopupApp: FC<{
  client: Awaited<ReturnType<typeof getApolloClient>>
  store: Store<ExtensionRootState>
}> = ({ client, store }) => {
  const theme = useTheme()

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PopupRoot />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

Promise.all([getApolloClient(), configureStore({ settings })])
  .then(([client, { store }]) => {
    root.render(
      <ErrorBoundary>
        <PopupApp client={client} store={store} />
      </ErrorBoundary>,
    )
  })
  .catch((error) => {
    console.error('Failed in initialize extension popup app', error)
  })
