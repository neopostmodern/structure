import { NetworkStatus, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
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
import * as Styled from './LegacyLayout.style';

const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      _id
      name
    }
  }
`;
const VERSIONS_QUERY = gql`
  query Versions {
    versions {
      minimum
      recommended
    }
  }
`;

const LegacyLayout: React.FC<{}> = ({ children }) => {
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

  let content;
  let userIndicator;

  if (
    navigator.onLine &&
    (versions.networkStatus === NetworkStatus.error ||
      user.networkStatus === NetworkStatus.error)
  ) {
    return (
      <Styled.Container>
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
      </Styled.Container>
    );
  }

  if (isUserLoggingIn) {
    content = <Centered>Logging in...</Centered>;
  } else if (user.loading) {
    content = <Centered>Loading...</Centered>;
  } else if (user.data.currentUser?.name) {
    content = children;
    userIndicator = (
      <Styled.Username to="/me">{user.data.currentUser.name}.</Styled.Username>
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
      {!navigator.onLine && <i>Offline</i>}
      <Styled.Header>
        <Styled.Title>{headline}</Styled.Title>
        <Styled.UserIndicator>{userIndicator}</Styled.UserIndicator>
      </Styled.Header>
      <VersionMarks
        versions={versions.loading ? 'loading' : versions.data.versions}
      />
      {content}
    </Styled.Container>
  );
};

export default LegacyLayout;
