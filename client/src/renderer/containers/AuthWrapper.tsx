import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import packageJson from '../../../package.json';
import { requestLogin } from '../actions/userInterface';
import FatalApolloError from '../components/FatalApolloError';
import LoginView from '../components/LoginView';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery, ProfileQueryVariables } from '../generated/ProfileQuery';
import { RootState } from '../reducers';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { PROFILE_QUERY } from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import ComplexLayout from './ComplexLayout';
import SettingsPage from './SettingsPage';

const AuthWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useDispatch();
  const profileQuery = useDataState(
    useQuery<ProfileQuery, ProfileQueryVariables>(PROFILE_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: {
        currentVersion: packageJson.version,
      },
    })
  );

  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );
  const path = useSelector<RootState, string>(
    (state) => state.router.location?.pathname || ''
  );

  useEffect(() => {
    profileQuery.refetch();
  }, [isUserLoggingIn]);

  if (path === '/settings') {
    /* redundant routing prevents undesired children from being created in the
     * virtual DOM when navigating to /settings, but before the settings page
     * is rendered by the router */
    return <SettingsPage />;
  }
  if (isUserLoggingIn) {
    return <ComplexLayout loading="Logging in..." />;
  }
  if (profileQuery.state === DataState.LOADING) {
    return <ComplexLayout loading="Loading user..." />;
  }
  if (
    profileQuery.state === DataState.DATA &&
    profileQuery.data.currentUser?.name
  ) {
    return children;
  }

  return (
    <ComplexLayout>
      {profileQuery.state === DataState.ERROR ? (
        <FatalApolloError
          error={profileQuery.error}
          refetch={(): void => {
            profileQuery.refetch();
          }}
        />
      ) : (
        <>
          <VersionMarks
            versions={profileQuery.data.versions}
            currentPackageVersion={packageJson.version}
          />
          <LoginView
            openLoginModal={(): void => {
              dispatch(requestLogin());
            }}
          />
        </>
      )}
    </ComplexLayout>
  );
};

export default AuthWrapper;
