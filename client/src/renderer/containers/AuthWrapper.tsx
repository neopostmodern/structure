import { NetworkStatus, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestLogin } from '../actions/userInterface';
import Centered from '../components/Centered';
import { InlineButton, InternalLink } from '../components/CommonStyles';
import LoginView from '../components/LoginView';
import VersionMarks from '../components/VersionMarks';
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout';
import { Versions } from '../generated/Versions';
import { RootState } from '../reducers';
import * as Styled from './ComplexLayout.style';
import { PROFILE_QUERY, VERSIONS_QUERY } from './LegacyLayout';

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

  let content;

  if (
    navigator.onLine &&
    (versions.networkStatus === NetworkStatus.error ||
      user.networkStatus === NetworkStatus.error)
  ) {
    return (
      <Styled.PrimaryContent>
        <Centered>
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
      </Styled.PrimaryContent>
    );
  }

  let username = '...';
  if (isUserLoggingIn) {
    content = <Centered>Logging in...</Centered>;
  } else if (user.loading) {
    content = <Centered>Loading...</Centered>;
  } else if (user.data.currentUser?.name || isSettingsPage) {
    return children;
  } else {
    content = (
      <LoginView
        openLoginModal={(): void => {
          dispatch(requestLogin());
        }}
      />
    );
    username = 'Settings';
  }

  return (
    <Styled.Container>
      <Styled.Navigation>
        <Styled.Title>{headline}</Styled.Title>
      </Styled.Navigation>
      <Styled.PrimaryContent>
        <VersionMarks
          versions={versions.loading ? 'loading' : versions.data.versions}
        />
        {content}
      </Styled.PrimaryContent>
      <Styled.UserAndMenuIndicator>
        {!isSettingsPage && (
          <Styled.Username to="/me">{username}</Styled.Username>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default AuthWrapper;
