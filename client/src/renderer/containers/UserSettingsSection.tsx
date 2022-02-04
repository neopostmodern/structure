import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import { bookmarkletCode, rssFeedUrl } from '@structure/common';
import gql from 'graphql-tag';
import React from 'react';
import { useSelector } from 'react-redux';
import Centered from '../components/Centered';
import { InlineButton, TextField } from '../components/CommonStyles';
import Credentials from '../components/Credentials';
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

const UserSettingsSection: React.FC<{}> = () => {
  const { backendUrl } = useSelector<RootState, ConfigurationStateType>(
    (state) => state.configuration
  );
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

  if (navigator.onLine && userQuery.networkStatus === NetworkStatus.error) {
    return (
      <>
        <h2>Integrations</h2>
        <Centered height={'20vh'}>
          <h2>Network error.</h2>
          This really should not have happened.
          <br />
          <br />
          <InlineButton
            type="button"
            onClick={(): void => window.location.reload()}
          >
            Give it another try.
          </InlineButton>
        </Centered>
      </>
    );
  }

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
    <>
      <h2>Integrations</h2>
      <SettingsEntry
        title="Bookmarklet (desktop app)"
        comment="This bookmarklet will save links via the desktop app. To use it, the desktop app must be running (or it will be opened) and you must be logged in. The bookmarklet contains no authentication token."
      >
        <TextField
          type="text"
          readOnly
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
          revokeCredential({ variables: { purpose } });
        }}
      />
    </>
  );
};

export default UserSettingsSection;
