import { useQuery } from '@apollo/client';
import { AccountCircle, LocalOffer, Settings } from '@mui/icons-material';
import { CircularProgress, Stack } from '@mui/material';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import UserIdContext from '../utils/UserIdContext';
import packageJson from '../../../package.json';
import Centered from '../components/Centered';
import FatalApolloError from '../components/FatalApolloError';
import Gap from '../components/Gap';
import Navigation from '../components/Navigation';
import { NetworkIndicatorContainer } from '../components/NetworkOperationsIndicator';
import UserAndMenuIndicatorDesktop from '../components/UserAndMenuIndicatorDesktop';
import VersionMarks from '../components/VersionMarks';
import { ProfileQuery, ProfileQueryVariables } from '../generated/graphql';
import useIsOnline from '../hooks/useIsOnline';
import usePrevious from '../hooks/usePrevious';
import { RootState } from '../reducers';
import { useIsDesktopLayout } from '../utils/mediaQueryHooks';
import { PROFILE_QUERY } from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import * as Styled from './ComplexLayout.style';

export interface AdditionalNavigationItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

const Loading = ({
  loadingComponent: LoadingComponent,
  loading,
}: {
  loading?: boolean | string;
  loadingComponent?: () => ReactElement;
}) => {
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [setShowLoading]);

  if (!showLoading) {
    return null;
  }

  return LoadingComponent ? (
    <LoadingComponent />
  ) : (
    <Centered>
      <Stack alignItems="center">
        <CircularProgress color="inherit" disableShrink />
        <Gap vertical={1} />
        {typeof loading === 'string' ? loading : <>&nbsp;</>}
      </Stack>
    </Centered>
  );
};

const ComplexLayout: React.FC<
  React.PropsWithChildren<{
    primaryActions?: JSX.Element | null | false;
    secondaryActions?: JSX.Element | null;
    loading?: boolean | string;
    loadingComponent?: () => ReactElement;
    wide?: boolean;
  }>
> = ({
  children,
  primaryActions,
  secondaryActions,
  wide = false,
  loading = false,
  loadingComponent,
}) => {
  const profileQuery = useDataState(
    useQuery<ProfileQuery, ProfileQueryVariables>(PROFILE_QUERY, {
      fetchPolicy: 'cache-only', // profile query is always fetched by AuthWrapper (above in hierarchy)
      variables: {
        currentVersion: packageJson.version,
      },
    })
  );

  const isDesktopLayout = useIsDesktopLayout();
  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn
  );
  const wasUserLoggingIn = usePrevious(isUserLoggingIn);
  const isLoggedInThenUserId =
    profileQuery.state === DataState.DATA && profileQuery.data.currentUser?._id;

  useEffect(() => {
    if (wasUserLoggingIn && !isUserLoggingIn) {
      profileQuery.refetch();
    }
  }, [wasUserLoggingIn, isUserLoggingIn]);

  const additionalNavigationItems: Array<AdditionalNavigationItem> = useMemo(
    () =>
      [
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
            profileQuery.state === DataState.DATA &&
            profileQuery.data.currentUser
              ? profileQuery.data.currentUser.name
              : '...',
          path: '/me',
          icon: <AccountCircle />,
        },
      ].filter(({ path }) => isLoggedInThenUserId || path === '/settings'),
    [isLoggedInThenUserId, profileQuery]
  );

  const online = useIsOnline();

  return (
    <UserIdContext.Provider value={isLoggedInThenUserId || ''}>
      <Styled.Container>
        <Styled.Navigation>
          <Navigation
            drawerNavigationItems={
              isDesktopLayout ? undefined : additionalNavigationItems
            }
          />
        </Styled.Navigation>
        <Styled.PrimaryContent wide={wide}>
          {!online && (
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
                currentPackageVersion={packageJson.version}
              />
              {profileQuery.state === DataState.LOADING || loading ? (
                <Loading
                  loading={loading}
                  loadingComponent={loadingComponent}
                />
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
          <UserAndMenuIndicatorDesktop
            additionalNavigationItems={additionalNavigationItems}
          />
        )}
      </Styled.Container>
    </UserIdContext.Provider>
  );
};

export default ComplexLayout;
