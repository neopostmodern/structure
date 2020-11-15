import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { useDispatch, useSelector } from 'react-redux'
import { setBackendUrl } from '../actions/configuration'
import { bookmarkletCode, rssFeedUrl } from '../../util/linkGenerator'
import {
  RequestNewCredentialMutation,
  RequestNewCredentialMutationVariables,
} from '../generated/RequestNewCredentialMutation'
import { RootState } from '../reducers'
import { ConfigurationStateType } from '../reducers/configuration'
import { Menu, MenuButton } from '../components/Menu'
import {
  RevokeCredentialMutation,
  RevokeCredentialMutationVariables,
} from '../generated/RevokeCredentialMutation'

import { UserCredentialsQuery } from '../generated/UserCredentialsQuery'
import Credentials from '../components/Credentials'
import SettingsEntry from '../components/SettingsEntry'
import { InternalLink, TextField } from '../components/CommonStyles'

const userCredentialsFragment = `
currentUser {
	_id

	credentials {
		bookmarklet
		rss
	}
}
`

const USER_CREDENTIALS_QUERY = gql`
  query UserCredentialsQuery {
    ${userCredentialsFragment}
  }
`
const REQUEST_NEW_CREDENTIAL_MUTATION = gql`
  mutation RequestNewCredentialMutation($purpose: String!) {
    requestNewCredential(purpose: $purpose) {
			${userCredentialsFragment}
		}
  }
`
const REVOKE_CREDENTIAL_MUTATION = gql`
  mutation RevokeCredentialMutation($purpose: String!) {
    revokeCredential(purpose: $purpose) {
			${userCredentialsFragment}
    }
  }
`

const UserPage: React.FC<{}> = () => {
  const { backendUrl, backendUrlDefault } = useSelector<
    RootState,
    ConfigurationStateType
  >((state) => state.configuration)
  const dispatch = useDispatch()
  const userQuery = useQuery<UserCredentialsQuery>(USER_CREDENTIALS_QUERY, {
    fetchPolicy: 'cache-and-network',
  })
  const [requestNewCredential] = useMutation<
    RequestNewCredentialMutation,
    RequestNewCredentialMutationVariables
  >(REQUEST_NEW_CREDENTIAL_MUTATION)
  const [revokeCredential] = useMutation<
    RevokeCredentialMutation,
    RevokeCredentialMutationVariables
  >(REVOKE_CREDENTIAL_MUTATION)

  const credentialsConfiguration = userQuery.loading
    ? 'loading'
    : [
        {
          displayName: 'Bookmarklet',
          name: 'bookmarklet',
          value:
            userQuery.data.currentUser.credentials.bookmarklet &&
            bookmarkletCode(
              backendUrl,
              userQuery.data.currentUser.credentials.bookmarklet,
            ),
        },
        {
          displayName: 'RSS-Feed',
          name: 'rss',
          value:
            userQuery.data.currentUser.credentials.rss &&
            rssFeedUrl(backendUrl, userQuery.data.currentUser.credentials.rss),
        },
      ]

  return (
    <div>
      <Menu>
        <InternalLink to='/tags'>My tags</InternalLink>
        ,&nbsp;
        <MenuButton
          onClick={(): void => alert('This feature is not yet available')}
          disabled
        >
          Export my data
        </MenuButton>
        ,&nbsp;
        <MenuButton
          onClick={(): void => alert('This feature is not yet available')}
          disabled
        >
          Delete my account
        </MenuButton>
        {process.env.TARGET === 'web' && (
          <>
            ,&nbsp;
            <a href={`${BACKEND_URL}/logout`}>Logout</a>
          </>
        )}
      </Menu>
      <div style={{ marginTop: '2rem' }}>
        <h2>Credentials</h2>
        <Credentials
          credentials={credentialsConfiguration}
          requestNewCredential={(purpose): void => {
            requestNewCredential({ variables: { purpose } })
          }}
          revokeCredential={(purpose): void => {
            revokeCredential({ variables: { purpose } })
          }}
        />
        <h2>Configuration</h2>
        <SettingsEntry
          title='Server'
          actionTitle='Update'
          actionHandler={(): void => {
            dispatch(
              setBackendUrl(
                document.getElementById('configuration__backend-url').value,
              ),
            )
          }}
          comment={
            <>
              The backend server is in charge of storing your data (username,
              notes, tags, et cetera). You must trust this server (and/or the
              operator of it), since your data is only encrypted during the
              transport to the server, not on the server. This means the
              operator of the server can (theoretically) read and/or modify all
              your data.
              <br />
              Modifying the backend server URL causes a restart.{' '}
              <b>
                Setting an invalid value might make it impossible to restart the
                app.
              </b>{' '}
              Data is not migrated automatically when switching backend servers.
              <br />
              Default: {backendUrlDefault}
            </>
          }
        >
          <TextField
            id='configuration__backend-url'
            type='text'
            defaultValue={backendUrl}
            placeholder={backendUrlDefault}
          />
        </SettingsEntry>
        <h2>About</h2>
        You are using Structure {VERSION}
        <br />
        <br />
        Structure uses (amongst other things) Electron, React, Redux, React Hook
        Form, Apollo/GraphQL, Lunchtype22
        <br />
        {/* todo: ! */}
        Written in TypeScript, transpiled and bundled by Babel and Webpack
        <br />
        The backend uses express, mongoose, passport.js on node.js with mongoDB
        <br />
        <br />
        Find the Structure source code{' '}
        <a
          href='https://github.com/neopostmodern/structure'
          target='_blank'
          rel='noopener noreferrer'
        >
          on GitHub
        </a>
      </div>
    </div>
  )
}

export default UserPage
