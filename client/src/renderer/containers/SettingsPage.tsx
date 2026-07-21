import { useQuery } from '@apollo/client/react'
import { Typography } from '@mui/material'
import { gql } from 'graphql-tag'
import { FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBackendUrl } from '../actions/configuration'
import AdvancedSettings from '../components/AdvancedSettings'
import Configuration from '../components/Configuration'
import Gap from '../components/Gap'
import type { TinyUserQuery } from '../generated/graphql'
import { RootState } from '../reducers'
import { ConfigurationStateType } from '../reducers/configuration'
import ComplexLayout from './ComplexLayout'
import UserSettingsSection from './UserSettingsSection'

const TINY_USER_QUERY = gql`
  query TinyUser {
    currentUser {
      _id
    }
  }
`

const SettingsPage: FC = () => {
  const { backendUrl, backendUrlDefault } = useSelector<
    RootState,
    ConfigurationStateType
  >((state) => state.configuration)
  const dispatch = useDispatch()
  const userQuery = useQuery<TinyUserQuery>(TINY_USER_QUERY, {
    fetchPolicy: 'cache-only',
  })

  const isLoggedIn = userQuery.data?.currentUser

  const handleBackendUrlChange = useCallback(
    (newBackendUrl: string): void => {
      dispatch(setBackendUrl(newBackendUrl))
    },
    [dispatch],
  )

  return (
    <ComplexLayout>
      <Typography variant='h1'>Settings</Typography>
      <Gap vertical={1} />
      {isLoggedIn && (
        <>
          <UserSettingsSection />
          <Gap vertical={2} />
        </>
      )}
      <Configuration
        currentBackendUrl={backendUrl}
        defaultBackendUrl={backendUrlDefault}
        onChangeBackendUrl={handleBackendUrlChange}
      />
      <AdvancedSettings />
    </ComplexLayout>
  )
}

export default SettingsPage
