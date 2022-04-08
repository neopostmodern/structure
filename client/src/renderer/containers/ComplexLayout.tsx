import { useQuery } from '@apollo/client';
import { AccountCircle, LocalOffer, Settings } from '@mui/icons-material';
import { Button, CircularProgress, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { version as currentPackageVersion } from '../../../package.json';
import Centered from '../components/Centered';
import { Menu } from '../components/Menu';
import Navigation from '../components/Navigation';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery } from '../generated/ProfileQuery';
import { RootState } from '../reducers';
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import { PROFILE_QUERY } from '../utils/sharedQueries';
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
  const profileQuery = useQuery<ProfileQuery>(PROFILE_QUERY, {
    fetchPolicy: gracefulNetworkPolicy(),
    variables: {
      currentVersion: currentPackageVersion,
    },
  });

  const isDesktopLayout = useIsDesktopLayout();
  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );

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
      label: profileQuery.data?.currentUser?.name || '...',
      path: '/me',
      icon: <AccountCircle />,
    },
  ];

  let isProfileQueryLoading = false;
  if (profileQuery.loading) {
    isProfileQueryLoading = !profileQuery.data;
  } else {
    if (!profileQuery.data) {
      throw Error('[ComplexLayout] Illegal state: no data');
    }
  }

  return (
    <Styled.Container>
      {!navigator.onLine && (
        <Styled.OfflineBanner>Offline</Styled.OfflineBanner>
      )}
      <Styled.Navigation>
        <Navigation
          drawerNavigationItems={
            isDesktopLayout ? undefined : additionalNavigationItems
          }
        />
      </Styled.Navigation>
      <Styled.PrimaryContent wide={wide}>
        <VersionMarks
          versions={
            isProfileQueryLoading ? 'loading' : profileQuery.data.versions
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
