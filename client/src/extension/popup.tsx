import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { getApolloClient } from '../renderer/apollo'
import ErrorBoundary from '../renderer/components/ErrorBoundary'
import configureStore from '../renderer/configureStore'
import { RootState } from '../renderer/reducers'
import '../renderer/styles/fonts.global.css'
import useTheme from '../renderer/styles/useTheme'
import PopupAuthWrapper from './PopupAuthWrapper'

const PopupApp: FC<{
  client: Awaited<ReturnType<typeof getApolloClient>>
  store: Store<RootState>
}> = ({ client, store }) => {
  const theme = useTheme()

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PopupAuthWrapper />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

Promise.all([getApolloClient(), configureStore()])
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

// WIE LANGE REDEST DU NOCH
