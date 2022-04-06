import { useQuery } from '@apollo/client';
import { CircularProgress, Stack, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { version as currentPackageVersion } from '../../../package.json';
import Centered from '../components/Centered';
import Navigation from '../components/Navigation';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery } from '../generated/ProfileQuery';
import { RootState } from '../reducers';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { PROFILE_QUERY } from '../utils/sharedQueries';
import * as Styled from './ComplexLayout.style';

const ComplexLayout: React.FC<
  React.PropsWithChildren<{
    primaryActions?: JSX.Element | null | false;
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
  const profileQuery = useQuery<ProfileQuery>(PROFILE_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: {
      currentVersion: currentPackageVersion,
    },
  });

  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );
  const path = useSelector<RootState, string>(
    (state) => state.router.location?.pathname || ''
  );

  useEffect(() => {
    profileQuery.refetch();
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
        <VersionMarks
          versions={
            profileQuery.loading || !profileQuery.data
              ? 'loading'
              : profileQuery.data.versions
          }
          currentPackageVersion={currentPackageVersion}
        />
        {(!profileQuery.data && profileQuery.loading) || loading ? (
          <Centered>
            <Stack alignItems="center">
              <CircularProgress color="inherit" />
              {typeof loading === 'string' && loading}
            </Stack>
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
          <Tooltip title="Settings">
            <Styled.Username to="/me">
              {profileQuery.data?.currentUser?.name || '...'}
            </Styled.Username>
          </Tooltip>
        )}
      </Styled.UserAndMenuIndicator>
    </Styled.Container>
  );
};

export default ComplexLayout;
