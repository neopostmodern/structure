import { useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Centered from '../components/Centered';
import Navigation from '../components/Navigation';
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout';
import { RootState } from '../reducers';
import { PROFILE_QUERY } from '../utils/sharedQueries';
import * as Styled from './ComplexLayout.style';

const ComplexLayout: React.FC<
  React.PropsWithChildren<{
    primaryActions?: JSX.Element | null;
    secondaryActions?: JSX.Element | null;
    loading?: boolean | string;
    wide?: boolean;
  }>
> = ({
  children,
  primaryActions,
  secondaryActions,
  wide = false,
  loading = false,
}) => {
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

  return (
    <Styled.Container>
      {!navigator.onLine && (
        <Styled.OfflineBanner>Offline</Styled.OfflineBanner>
      )}
      <Styled.Navigation>
        <Navigation />
      </Styled.Navigation>
      <Styled.PrimaryContent wide={wide}>
        {(!user.data && user.loading) || loading ? (
          <Centered>
            <CircularProgress color="inherit" />
            {typeof loading === 'string' && loading}
          </Centered>
        ) : (
          children
        )}
      </Styled.PrimaryContent>
      {primaryActions && (
        <Styled.PrimaryActions>{primaryActions}</Styled.PrimaryActions>
      )}
      {secondaryActions && (
        <Styled.SecondaryActions>{secondaryActions}</Styled.SecondaryActions>
      )}
      <Styled.UserAndMenuIndicator>
        {path !== '/me' && (
          <Styled.Username to="/me">
            {user.data?.currentUser?.name || '...'}
          </Styled.Username>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default ComplexLayout;