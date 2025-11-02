import { useMutation, useQuery } from '@apollo/client/react'
import { Typography } from '@mui/material'
import { bookmarkletCode, rssFeedUrl } from '@structure/common'
import { gql } from 'graphql-tag'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import Credentials, { CredentialsOrLoading } from '../components/Credentials'
import FatalApolloError from '../components/FatalApolloError'
import { StructureTextField } from '../components/formComponents'
import SettingsEntry from '../components/SettingsEntry'
import type {
  RequestNewCredentialMutation,
  RequestNewCredentialMutationVariables,
  RevokeCredentialMutation,
  RevokeCredentialMutationVariables,
  UserCredentialsQuery,
} from '../generated/graphql'
import { RootState } from '../reducers'
import { ConfigurationStateType } from '../reducers/configuration'
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy'
import useDataState, { DataState } from '../utils/useDataState'

const userCredentialsFragment = gql`
  fragment UserCredentialsFragment on User {
    _id

    credentials {
      bookmarklet
      rss
    }
  }
`

const USER_CREDENTIALS_QUERY = gql`
  ${userCredentialsFragment}
  query UserCredentials {
    currentUser {
      ...UserCredentialsFragment
    }
  }
`
const REQUEST_NEW_CREDENTIAL_MUTATION = gql`
  ${userCredentialsFragment}
  mutation RequestNewCredential($purpose: String!) {
    requestNewCredential(purpose: $purpose) {
      ...UserCredentialsFragment
    }
  }
`
const REVOKE_CREDENTIAL_MUTATION = gql`
  ${userCredentialsFragment}
  mutation RevokeCredential($purpose: String!) {
    revokeCredential(purpose: $purpose) {
      ...UserCredentialsFragment
    }
  }
`

const UserSettingsSection: FC = () => {
  const { backendUrl } = useSelector<RootState, ConfigurationStateType>(
    (state) => state.configuration,
  )
  const userQuery = useDataState(
    useQuery<UserCredentialsQuery>(USER_CREDENTIALS_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
    }),
  )
  const [requestNewCredential] = useMutation<
    RequestNewCredentialMutation,
    RequestNewCredentialMutationVariables
  >(REQUEST_NEW_CREDENTIAL_MUTATION)
  const [revokeCredential] = useMutation<
    RevokeCredentialMutation,
    RevokeCredentialMutationVariables
  >(REVOKE_CREDENTIAL_MUTATION)

  if (userQuery.state === DataState.ERROR) {
    return (
      <>
        <Typography variant='h2'>Integrations</Typography>
        <FatalApolloError query={userQuery} />
      </>
    )
  }

  let credentialsConfiguration: CredentialsOrLoading
  if (userQuery.state === DataState.LOADING) {
    credentialsConfiguration = 'loading'
  } else {
    credentialsConfiguration = [
      {
        displayName: 'Bookmarklet (standalone)',
        name: 'bookmarklet',
        value:
          userQuery.data.currentUser?.credentials?.bookmarklet &&
          bookmarkletCode(
            backendUrl,
            userQuery.data.currentUser.credentials.bookmarklet,
          ),
        comment:
          'This bookmarklet will save links in the background. You will not be able to change the title or tag it immediately. The bookmarklet uses an authentication token.',
      },
      {
        displayName: 'RSS-Feed',
        name: 'rss',
        value:
          userQuery.data.currentUser?.credentials?.rss &&
          rssFeedUrl(backendUrl, userQuery.data.currentUser.credentials.rss),
      },
    ]
  }

  return (
    <>
      <Typography variant='h2'>Integrations</Typography>
      <SettingsEntry
        title='Bookmarklet (desktop app)'
        comment='This bookmarklet will save links via the desktop app. To use it, the desktop app must be running (or it will be opened) and you must be logged in. The bookmarklet contains no authentication token.'
      >
        <StructureTextField
          type='text'
          inputProps={{ readOnly: true }}
          value={`javascript:void(open('${backendUrl}/desktop/add?url='+encodeURIComponent(location.href)))`}
        />
      </SettingsEntry>
      <SettingsEntry
        title={
          <>
            Bookmarklet
            <br />
            (web app)
          </>
        }
        comment='This bookmarklet will save links via the web app. The web app will open in a new tab and you must be logged in. The bookmarklet contains no authentication token.'
      >
        <StructureTextField
          type='text'
          inputProps={{ readOnly: true }}
          value={`javascript:void(open('${__WEB_FRONTEND_HOST__}/notes/add?url='+encodeURIComponent(location.href)+'&autoSubmit'))`}
        />
      </SettingsEntry>
      <Credentials
        credentials={credentialsConfiguration}
        requestNewCredential={(purpose): void => {
          requestNewCredential({ variables: { purpose } })
        }}
        revokeCredential={(purpose): void => {
          revokeCredential({ variables: { purpose } })
        }}
      />
    </>
  )
}

export default UserSettingsSection
