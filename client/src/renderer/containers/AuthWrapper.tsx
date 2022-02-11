import { NetworkStatus, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../actions/userInterface';
import { InternalLink } from '../components/CommonStyles';
import LoginView from '../components/LoginView';
import NetworkError from '../components/NetworkError';
import VersionMarks from '../components/VersionMarks';
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout';
import { Versions } from '../generated/Versions';
import { RootState } from '../reducers';
import { PROFILE_QUERY, VERSIONS_QUERY } from '../utils/sharedQueries';
import ComplexLayout from './ComplexLayout';
import * as Styled from './ComplexLayout.style';

const AuthWrapper: React.FC<
  React.PropsWithChildren<{
    primaryActions?: JSX.Element;
    secondaryActions?: JSX.Element;
  }>
> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useQuery<CurrentUserForLayout>(PROFILE_QUERY);
  const versions = useQuery<Versions>(VERSIONS_QUERY);

  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );
  const path = useSelector<RootState, string>(
    (state) => state.router.location.pathname
  );

  useEffect(() => {
    user.refetch();
  }, [isUserLoggingIn]);

  let headline = <>Structure</>;
  if (path !== '/') {
    headline = (
      <span>
        <InternalLink to="/">/</InternalLink>
        {path.substr(1)}
      </span>
    );
  }

  const isSettingsPage = path === '/me';

  if (isUserLoggingIn) {
    return <ComplexLayout loading="Logging in..." />;
  }
  if (user.loading) {
    return <ComplexLayout loading="Loading user..." />;
  }
  if (user.data?.currentUser?.name || isSettingsPage) {
    return children;
  }

  let content;
  if (
    navigator.onLine &&
    (versions.networkStatus === NetworkStatus.error ||
      user.networkStatus === NetworkStatus.error) &&
    !isSettingsPage
  ) {
    content = (
      <NetworkError
        error={versions.error || user.error}
        refetch={(): void => {
          versions.refetch();
          user.refetch();
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

  return (
    <Styled.Container>
      <Styled.Navigation>
        <Styled.Title>{headline}</Styled.Title>
      </Styled.Navigation>
      <Styled.PrimaryContent>
        <VersionMarks
          versions={
            versions.loading || !versions.data
              ? 'loading'
              : versions.data.versions
          }
        />
        {content}
      </Styled.PrimaryContent>
      <Styled.UserAndMenuIndicator>
        {!isSettingsPage && (
          <Styled.Username to="/me">Settings</Styled.Username>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default AuthWrapper;
