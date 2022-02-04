import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Centered from '../components/Centered';
import { InternalLink } from '../components/CommonStyles';
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout';
import { RootState } from '../reducers';
import * as Styled from './ComplexLayout.style';
import { PROFILE_QUERY } from './LegacyLayout';

const ComplexLayout: React.FC<
  React.PropsWithChildren<{
    primaryActions?: JSX.Element;
    secondaryActions?: JSX.Element;
  }>
> = ({ children, primaryActions, secondaryActions }) => {
  const user = useQuery<CurrentUserForLayout>(PROFILE_QUERY);

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

  return (
    <Styled.Container>
      {!navigator.onLine && (
        <Styled.OfflineBanner>Offline</Styled.OfflineBanner>
      )}
      <Styled.Navigation>
        <Styled.Title>{headline}</Styled.Title>
      </Styled.Navigation>
      <Styled.PrimaryContent>
        {user.loading ? <Centered>Loading...</Centered> : children}
      </Styled.PrimaryContent>
      {primaryActions && (
        <Styled.PrimaryActions>{primaryActions}</Styled.PrimaryActions>
      )}
      {secondaryActions && (
        <Styled.SecondaryActions>{secondaryActions}</Styled.SecondaryActions>
      )}
      <Styled.UserAndMenuIndicator>
        {!isSettingsPage && (
          <Styled.Username to="/me">
            {user.data.currentUser?.name || '...'}
          </Styled.Username>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default ComplexLayout;
