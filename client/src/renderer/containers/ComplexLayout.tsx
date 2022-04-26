import { useQuery } from '@apollo/client';
import { AccountCircle, LocalOffer, Settings } from '@mui/icons-material';
import { Button, CircularProgress, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { version as currentPackageVersion } from '../../../package.json';
import Centered from '../components/Centered';
import FatalApolloError from '../components/FatalApolloError';
import Gap from '../components/Gap';
import { Menu } from '../components/Menu';
import Navigation from '../components/Navigation';
import { NetworkIndicatorContainer } from '../components/NetworkOperationsIndicator';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery } from '../generated/ProfileQuery';
import { RootState } from '../reducers';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import { PROFILE_QUERY } from '../utils/sharedQueries';
import useDataState, { DataState } from '../utils/useDataState';
import * as Styled from './ComplexLayout.style';

export interface AdditionalNavigationItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

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
  const profileQuery = useDataState(
    useQuery<ProfileQuery>(PROFILE_QUERY, {
      fetchPolicy: gracefulNetworkPolicy('cache-first'),
      variables: {
        currentVersion: currentPackageVersion,
      },
    })
  );

  const isDesktopLayout = useIsDesktopLayout();
  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );
  const isLoggedIn =
    profileQuery.state === DataState.DATA &&
    profileQuery.data.currentUser?.name;

  useEffect(() => {
    profileQuery.refetch();
  }, [isUserLoggingIn]);

  const additionalNavigationItems: Array<AdditionalNavigationItem> = [
    {
      label: 'Your tags',
      path: '/tags',
      icon: <LocalOffer />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    },
    {
      label:
        profileQuery.state === DataState.DATA && profileQuery.data.currentUser
          ? profileQuery.data.currentUser.name
          : '...',
      path: '/me',
      icon: <AccountCircle />,
    },
  ].filter(({ path }) => isLoggedIn || path === '/settings');

  return (
    <Styled.Container>
      <Styled.Navigation>
        <Navigation
          drawerNavigationItems={
            isDesktopLayout ? undefined : additionalNavigationItems
          }
        />
      </Styled.Navigation>
      <Styled.PrimaryContent wide={wide}>
        {!navigator.onLine && (
          <NetworkIndicatorContainer>Offline</NetworkIndicatorContainer>
        )}
        {profileQuery.state === DataState.ERROR ? (
          <FatalApolloError query={profileQuery} />
        ) : (
          <>
            <VersionMarks
              versions={
                profileQuery.state === DataState.DATA
                  ? profileQuery.data.versions
                  : 'loading'
              }
              currentPackageVersion={currentPackageVersion}
            />
            {profileQuery.state === DataState.LOADING || loading ? (
              <Centered>
                <Stack alignItems="center">
                  <CircularProgress color="inherit" />
                  <Gap vertical={1} />
                  {typeof loading === 'string' && loading}
                </Stack>
              </Centered>
            ) : (
              children
            )}
          </>
        )}
      </Styled.PrimaryContent>
      {primaryActions && (
        <Styled.PrimaryActions>{primaryActions}</Styled.PrimaryActions>
      )}
      {secondaryActions && (
        <Styled.SecondaryActions>{secondaryActions}</Styled.SecondaryActions>
      )}
      {isDesktopLayout && (
        <Styled.UserAndMenuIndicator>
          <Menu>
            {additionalNavigationItems.map(({ label, path, icon }) => (
              <Button
                key={path}
                size="large"
                startIcon={icon}
                to={path}
                component={Link}
              >
                {label}
              </Button>
            ))}
          </Menu>
        </Styled.UserAndMenuIndicator>
      )}
    </Styled.Container>
  );
};

export default ComplexLayout;
