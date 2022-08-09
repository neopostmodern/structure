import { useQuery } from '@apollo/client';
import { Button, Link, Typography } from '@mui/material';
import gql from 'graphql-tag';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { requestLogout } from '../actions/userInterface';
import ErrorSnackbar from '../components/ErrorSnackbar';
import Gap from '../components/Gap';
import { Menu } from '../components/Menu';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import UserInfo from '../components/UserInfo';
import { UserQuery } from '../generated/UserQuery';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';

const USER_QUERY = gql`
  query UserQuery {
    currentUser {
      _id
      authenticationProvider
      createdAt
      name
    }
  }
`;

const UserPage: FC = () => {
  const dispatch = useDispatch();
  const userQuery = useDataState(
    useQuery<UserQuery>(USER_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
    })
  );

  return (
    <ComplexLayout
      primaryActions={
        <Menu direction="vertical-horizontal">
          <Button
            size="huge"
            onClick={(): void => alert('This feature is not yet available')}
            disabled
          >
            Export my data
          </Button>
          <Button
            size="huge"
            onClick={(): void => alert('This feature is not yet available')}
            disabled
          >
            Delete my account
          </Button>
          <Button
            size="huge"
            onClick={(): void => {
              dispatch(requestLogout());
            }}
          >
            Logout
          </Button>
        </Menu>
      }
      loading={userQuery.state === DataState.LOADING}
    >
      <ErrorSnackbar
        error={
          userQuery.state === DataState.ERROR ? userQuery.error : undefined
        }
        actionDescription={'retrieve user data'}
        retry={userQuery.refetch}
      />
      <NetworkOperationsIndicator query={userQuery} />
      {userQuery.state === DataState.DATA && userQuery.data.currentUser && (
        <>
          <UserInfo user={userQuery.data.currentUser} />
          <Gap vertical={2} />
        </>
      )}
      <Typography variant="h2">About</Typography>
      You are using Structure {VERSION}
      <br />
      Find the Structure source code{' '}
      <Link
        href="https://github.com/neopostmodern/structure"
        target="_blank"
        rel="noopener noreferrer"
      >
        on GitHub
      </Link>
    </ComplexLayout>
  );
};

export default UserPage;
