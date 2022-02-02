import { useMutation, useQuery } from '@apollo/client';
import { bookmarkletCode, rssFeedUrl } from '@structure/common';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBackendUrl } from '../actions/configuration';
import {
  ExternalLink,
  InternalLink,
  TextField,
} from '../components/CommonStyles';
import Credentials from '../components/Credentials';
import { Menu, MenuButton } from '../components/Menu';
import SettingsEntry from '../components/SettingsEntry';
import {
  RequestNewCredentialMutation,
  RequestNewCredentialMutationVariables,
} from '../generated/RequestNewCredentialMutation';
import {
  RevokeCredentialMutation,
  RevokeCredentialMutationVariables,
} from '../generated/RevokeCredentialMutation';
import { UserCredentialsQuery } from '../generated/UserCredentialsQuery';
import { RootState } from '../reducers';
import { ConfigurationStateType } from '../reducers/configuration';
import ComplexLayout from './ComplexLayout';

const userCredentialsFragment = gql`
  fragment UserCredentialsFragment on User {
    _id

    credentials {
      bookmarklet
      rss
    }
  }
`;

const USER_CREDENTIALS_QUERY = gql`
  ${userCredentialsFragment}
  query UserCredentialsQuery {
    currentUser {
      ...UserCredentialsFragment
    }
  }
`;
const REQUEST_NEW_CREDENTIAL_MUTATION = gql`
  ${userCredentialsFragment}
  mutation RequestNewCredentialMutation($purpose: String!) {
    requestNewCredential(purpose: $purpose) {
      ...UserCredentialsFragment
    }
  }
`;
const REVOKE_CREDENTIAL_MUTATION = gql`
  ${userCredentialsFragment}
  mutation RevokeCredentialMutation($purpose: String!) {
    revokeCredential(purpose: $purpose) {
      ...UserCredentialsFragment
    }
  }
`;

const UserPage: React.FC<{}> = () => {
  const { backendUrl, backendUrlDefault } = useSelector<
    RootState,
    ConfigurationStateType
  >((state) => state.configuration);
  const dispatch = useDispatch();
  const userQuery = useQuery<UserCredentialsQuery>(USER_CREDENTIALS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const [requestNewCredential] = useMutation<
    RequestNewCredentialMutation,
    RequestNewCredentialMutationVariables
  >(REQUEST_NEW_CREDENTIAL_MUTATION);
  const [revokeCredential] = useMutation<
    RevokeCredentialMutation,
    RevokeCredentialMutationVariables
  >(REVOKE_CREDENTIAL_MUTATION);

  const credentialsConfiguration = userQuery.loading
    ? 'loading'
    : [
        {
          displayName: 'Bookmarklet (standalone)',
          name: 'bookmarklet',
          value:
            userQuery.data.currentUser.credentials.bookmarklet &&
            bookmarkletCode(
              backendUrl,
              userQuery.data.currentUser.credentials.bookmarklet
            ),
          comment:
            'This bookmarklet will save links in the background. You will not be able to change the title or tag it immediately. The bookmarklet uses an authentication token.',
        },
        {
          displayName: 'RSS-Feed',
          name: 'rss',
          value:
            userQuery.data.currentUser.credentials.rss &&
            rssFeedUrl(backendUrl, userQuery.data.currentUser.credentials.rss),
        },
      ];

  return (
    <ComplexLayout
      primaryActions={
        <Menu>
          <InternalLink to="/tags">My tags</InternalLink>
          <MenuButton
            onClick={(): void => alert('This feature is not yet available')}
            disabled
          >
            Export my data
          </MenuButton>
          <MenuButton
            onClick={(): void => alert('This feature is not yet available')}
            disabled
          >
            Delete my account
          </MenuButton>
          {process.env.TARGET === 'web' && (
            <>
              <ExternalLink href={`${BACKEND_URL}/logout`}>Logout</ExternalLink>
            </>
          )}
        </Menu>
      }
    >
      <h2>Integrations</h2>
      <SettingsEntry
        title="Bookmarklet (desktop app)"
        comment="This bookmarklet will save links via the desktop app. To use it, the desktop app must be running (or it will be opened) and you must be logged in. The bookmarklet contains no authentication token."
      >
        <TextField
          type="text"
          readOnly
          value={`javascript:void(open('${BACKEND_URL}/desktop/add?url='+encodeURIComponent(location.href)))`}
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
        comment="This bookmarklet will save links via the web app. The web app will open in a new tab and you must be logged in. The bookmarklet contains no authentication token."
      >
        <TextField
          type="text"
          readOnly
          value={`javascript:void(open('${WEB_FRONTEND_HOST}/notes/add?url='+encodeURIComponent(location.href)+'&autoSubmit'))`}
        />
      </SettingsEntry>
      <Credentials
        credentials={credentialsConfiguration}
        requestNewCredential={(purpose): void => {
          requestNewCredential({ variables: { purpose } });
        }}
        revokeCredential={(purpose): void => {
          console.log(purpose);
          revokeCredential({ variables: { purpose } });
        }}
      />
      <h2>Configuration</h2>
      <SettingsEntry
        title="Server"
        actionTitle="Update"
        actionHandler={(): void => {
          dispatch(
            setBackendUrl(
              document.getElementById('configuration__backend-url').value
            )
          );
        }}
        comment={
          <>
            The backend server is in charge of storing your data (username,
            notes, tags, et cetera). You must trust this server (and/or the
            operator of it), since your data is only encrypted during the
            transport to the server, not on the server. This means the operator
            of the server can (theoretically) read and/or modify all your data.
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
          id="configuration__backend-url"
          type="text"
          defaultValue={backendUrl}
          placeholder={backendUrlDefault}
          disabled={process.env.TARGET === 'web'}
        />
      </SettingsEntry>
      <h2>About</h2>
      You are using Structure {VERSION}
      <br />
      Find the Structure source code{' '}
      <a
        href="https://github.com/neopostmodern/structure"
        target="_blank"
        rel="noopener noreferrer"
      >
        on GitHub
      </a>
    </ComplexLayout>
  );
};

export default UserPage;
