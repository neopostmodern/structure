import { NetworkStatus, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { version as currentPackageVersion } from '../../../package.json';
import { requestLogin } from '../actions/userInterface';
import LoginView from '../components/LoginView';
import Navigation from '../components/Navigation';
import NetworkError from '../components/NetworkError';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery, ProfileQueryVariables } from '../generated/ProfileQuery';
import { RootState } from '../reducers';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { PROFILE_QUERY } from '../utils/sharedQueries';
import ComplexLayout from './ComplexLayout';
import * as Styled from './ComplexLayout.style';

const AuthWrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useDispatch();
  const profileQuery = useQuery<ProfileQuery, ProfileQueryVariables>(
    PROFILE_QUERY,
    {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: {
        currentVersion: currentPackageVersion,
      },
    }
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

  const isSettingsPage = path === '/settings';

  if (isUserLoggingIn) {
    return <ComplexLayout loading="Logging in..." />;
  }
  if (profileQuery.loading) {
    return <ComplexLayout loading="Loading user..." />;
  }
  if (profileQuery.data?.currentUser?.name || isSettingsPage) {
    return children;
  }

  let content;
  if (
    navigator.onLine &&
    profileQuery.networkStatus === NetworkStatus.error &&
    !isSettingsPage
  ) {
    content = (
      <NetworkError
        error={profileQuery.error}
        refetch={(): void => {
          profileQuery.refetch();
        }}
      />
    );
  } else {
    content = (
      <LoginView
        openLoginModal={(): void => {
          dispatch(requestLogin());
        }}
      />
    );
  }

  let isProfileQueryLoading = false;
  if (profileQuery.loading) {
    isProfileQueryLoading = !profileQuery.data;
  } else {
    if (!profileQuery.data) {
      throw Error('[AuthWrapper] Illegal state: no data');
    }
  }

  return (
    <Styled.Container>
      <Styled.Navigation>
        <Navigation />
      </Styled.Navigation>
      <Styled.PrimaryContent>
        <VersionMarks
          versions={
            isProfileQueryLoading ? 'loading' : profileQuery.data.versions
          }
          currentPackageVersion={currentPackageVersion}
        />
        {content}
      </Styled.PrimaryContent>
      <Styled.UserAndMenuIndicator>
        {!isSettingsPage && (
          <Styled.Username to="/settings">Settings</Styled.Username>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default AuthWrapper;
