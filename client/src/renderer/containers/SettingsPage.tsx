import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { gql } from 'graphql-tag';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBackendUrl } from '../actions/configuration';
import AdvancedSettings from '../components/AdvancedSettings';
import { StructureTextField } from '../components/formComponents';
import Gap from '../components/Gap';
import SettingsEntry from '../components/SettingsEntry';
import { TinyUserQuery } from '../generated/graphql';
import { RootState } from '../reducers';
import { ConfigurationStateType } from '../reducers/configuration';
import ComplexLayout from './ComplexLayout';
import UserSettingsSection from './UserSettingsSection';

const TINY_USER_QUERY = gql`
  query TinyUser {
    currentUser {
      _id
    }
  }
`;

const SettingsPage: FC = () => {
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
    <ComplexLayout>
      <Typography variant="h1">Settings</Typography>
      <Gap vertical={1} />
      {isLoggedIn && (
        <>
          <UserSettingsSection />
          <Gap vertical={2} />
        </>
      )}
      <Typography variant="h2">Configuration</Typography>
      <SettingsEntry
        title="Server"
        actionTitle="Update"
        actionHandler={(): void => {
          dispatch(
            setBackendUrl(
              (
                document.getElementById(
                  'configuration__backend-url'
                ) as HTMLInputElement
              ).value
            )
          );
        }}
        readOnly={__BUILD_TARGET__ === 'web'}
        comment={
          <>
            The backend server is in charge of storing your data (username,
            notes, tags, et cetera). You must trust this server (and/or the
            operator of it), since your data is only encrypted during the
            transport to the server, not on the server. This means the operator
            of the server can (theoretically) read and/or modify all your data.
            <br />
            {__BUILD_TARGET__ === 'electron_renderer' ? (
              <>
                Modifying the backend server URL causes a restart.{' '}
                <b>
                  Setting an invalid value might make it impossible to restart
                  the app.
                </b>{' '}
                Data is not migrated automatically when switching backend
                servers.
                <br />
                Default: {backendUrlDefault}
              </>
            ) : (
              <>This setting can not be changed in the web version.</>
            )}
          </>
        }
      >
        <StructureTextField
          id="configuration__backend-url"
          type="text"
          defaultValue={backendUrl}
          placeholder={backendUrlDefault}
          disabled={__BUILD_TARGET__ === 'web'}
        />
      </SettingsEntry>
      <AdvancedSettings />
    </ComplexLayout>
  );
};

export default SettingsPage;
