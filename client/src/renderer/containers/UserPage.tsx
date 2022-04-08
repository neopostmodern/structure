import { useQuery } from '@apollo/client';
import { Button, Link, Typography } from '@mui/material';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch } from 'react-redux';
import { requestLogout } from '../actions/userInterface';
import ErrorSnackbar from '../components/ErrorSnackbar';
import Gap from '../components/Gap';
import { Menu } from '../components/Menu';
import UserInfo from '../components/UserInfo';
import { UserQuery } from '../generated/UserQuery';
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

const UserPage: React.FC = () => {
  const dispatch = useDispatch();
  const userQuery = useQuery<UserQuery>(USER_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const isLoading = userQuery.loading && !userQuery.data;

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
      loading={isLoading}
    >
      <ErrorSnackbar
        error={userQuery.error}
        actionDescription={'retrieve user data'}
        retry={userQuery.refetch}
      />
      {userQuery.data?.currentUser && (
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
