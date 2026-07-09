import { useMutation, useQuery } from '@apollo/client/react'
import { Typography } from '@mui/material'
import { gql } from 'graphql-tag'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from 'react-timeago'
import FatalApolloError from '../components/FatalApolloError'
import { StructureTextField } from '../components/formComponents'
import SettingsEntry from '../components/SettingsEntry'
import type {
  RevokeTokenMutation,
  RevokeTokenMutationVariables,
  UserTokensQuery,
} from '../generated/graphql'
import { RootState } from '../reducers'
import { ConfigurationStateType } from '../reducers/configuration'
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy'
import useDataState, { DataState } from '../utils/useDataState'

const userTokensFragment = gql`
  fragment UserTokensFragment on User {
    _id

    tokens {
      _id
      purpose
      comment
      createdAt
    }
  }
`

const USER_TOKENS_QUERY = gql`
  ${userTokensFragment}
  query UserTokens {
    currentUser {
      ...UserTokensFragment
    }
  }
`
const REVOKE_TOKEN_MUTATION = gql`
  ${userTokensFragment}
  mutation RevokeToken($tokenId: ID!) {
    revokeToken(tokenId: $tokenId) {
      ...UserTokensFragment
    }
  }
`

const UserSettingsSection: FC = () => {
  const { backendUrl } = useSelector<RootState, ConfigurationStateType>(
    (state) => state.configuration,
  )
  const userQuery = useDataState(
    useQuery<UserTokensQuery>(USER_TOKENS_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
    }),
  )
  const [revokeToken] = useMutation<
    RevokeTokenMutation,
    RevokeTokenMutationVariables
  >(REVOKE_TOKEN_MUTATION)

  if (userQuery.state === DataState.ERROR) {
    return (
      <>
        <Typography variant='h2'>Integrations</Typography>
        <FatalApolloError query={userQuery} />
      </>
    )
  }

  const extensionTokens =
    userQuery.state === DataState.DATA
      ? (userQuery.data.currentUser?.tokens.filter(
          (token) => token.purpose === 'extension',
        ) ?? [])
      : []

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
      {extensionTokens.length === 0 ? (
        <SettingsEntry
          title='Browser extension'
          comment='Connect from the extension itself.'
        >
          <i>Not connected</i>
        </SettingsEntry>
      ) : (
        extensionTokens.map((token) => (
          <SettingsEntry
            key={token._id}
            title='Browser extension'
            comment={
              token.comment ||
              'Connect from the extension itself. Revoking here signs out this browser extension immediately.'
            }
            actionTitle='Revoke access'
            actionHandler={() =>
              revokeToken({ variables: { tokenId: token._id } })
            }
          >
            <i>
              Connected <TimeAgo date={token.createdAt} />
            </i>
          </SettingsEntry>
        ))
      )}
    </>
  )
}

export default UserSettingsSection
