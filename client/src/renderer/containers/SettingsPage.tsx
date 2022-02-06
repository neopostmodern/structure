import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBackendUrl } from '../actions/configuration';
import { requestLogout } from '../actions/userInterface';
import { TextField } from '../components/CommonStyles';
import { Menu, MenuButton } from '../components/Menu';
import SettingsEntry from '../components/SettingsEntry';
import { TinyUserQuery } from '../generated/TinyUserQuery';
import { RootState } from '../reducers';
import { ConfigurationStateType } from '../reducers/configuration';
import ComplexLayout from './ComplexLayout';
import UserSettingsSection from './UserSettingsSection';

const TINY_USER_QUERY = gql`
  query TinyUserQuery {
    currentUser {
      _id
    }
  }
`;

const SettingsPage: React.FC = () => {
  const { backendUrl, backendUrlDefault } = useSelector<
    RootState,
    ConfigurationStateType
  >((state) => state.configuration);
  const dispatch = useDispatch();
  const userQuery = useQuery<TinyUserQuery>(TINY_USER_QUERY, {
    fetchPolicy: 'cache-only',
  });

  const isLoggedIn = userQuery.data?.currentUser;

  return (
    <ComplexLayout
      primaryActions={
        <Menu>
          {userQuery.data?.currentUser && (
            <InternalLink to="/tags">My tags</InternalLink>
          )}
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
          {isLoggedIn && (
            <MenuButton
              onClick={(): void => {
                dispatch(requestLogout());
              }}
            >
              Logout
            </MenuButton>
          )}
        </Menu>
      }
    >
      {isLoggedIn && <UserSettingsSection />}
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

export default SettingsPage;
