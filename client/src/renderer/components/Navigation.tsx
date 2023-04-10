import { Add, ArrowBack, ArrowForward, Home, Menu } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { goBack, goForward } from 'redux-first-history';
import styled, { css } from 'styled-components';
import { AdditionalNavigationItem } from '../containers/ComplexLayout';
import { RootState } from '../reducers';
import { HistoryStateType } from '../reducers/history';
import { breakpointDesktop, breakPointMobile } from '../styles/constants';
import { SHORTCUTS } from '../utils/keyboard';
import LastVisitedNotes from './LastVisitedNotes';
import TooltipWithShortcut from './TooltipWithShortcut';

const CustomDesktopAppBar = styled(Box)`
  @media (min-width: 40rem) and (max-width: ${breakpointDesktop - 0.001}rem) {
    margin-top: -0.5rem;
  }
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 39.999rem) {
    flex: 1;
  }
  @media (min-width: 40rem) and (max-width: ${breakpointDesktop - 0.001}rem) {
    width: calc(50% + 32px);
    min-width: 25rem;
  }
  @media (min-width: ${breakpointDesktop}rem) {
    flex-basis: 27rem;
    flex-grow: 0;
  }
`;

const TitleLink = styled(Link)`
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.18;
  color: inherit;

  &:not(:hover) {
    text-decoration: none;
  }

  @media (min-width: ${breakpointDesktop}rem) {
    margin-left: ${({ theme }) => theme.spacing(1)};
  }
`;

const HistoryTools = styled.div`
  align-self: center;
  display: flex;
`;

const ResponsiveFab = styled(Fab)<{ centered?: boolean }>`
  ${({ centered = false }) =>
    centered &&
    css`
      position: absolute;
      z-index: 1;
      top: -30px;
      left: 0;
      right: 0;
      margin: 0 auto;
    `}
`;

const Navigation = ({
  drawerNavigationItems,
}: {
  drawerNavigationItems?: Array<AdditionalNavigationItem>;
}) => {
  const isMobileLayout = useMediaQuery(`(max-width: ${breakPointMobile})`);

  const dispatch = useDispatch();
  const { lengthOfPast, lengthOfFuture } = useSelector<
    RootState,
    HistoryStateType
  >((state) => state.history);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleGoBack = useCallback(
    () => dispatch(goBack()),
    [dispatch, goBack]
  );
  const handleGoForward = useCallback(
    () => dispatch(goForward()),
    [dispatch, goForward]
  );
  const handleDrawerOpen = useCallback(
    () => setIsDrawerOpen(true),
    [setIsDrawerOpen]
  );
  const handleDrawerClose = useCallback(
    () => setIsDrawerOpen(false),
    [setIsDrawerOpen]
  );

  const addNoteFab = (
    <TooltipWithShortcut
      title="Add new note"
      shortcut={SHORTCUTS.NEW_NOTE_PAGE}
    >
      <ResponsiveFab
        centered={isMobileLayout || undefined}
        color="primary"
        aria-label="add"
        component={Link}
        to="/notes/add"
      >
        <Add fontSize="large" />
      </ResponsiveFab>
    </TooltipWithShortcut>
  );
  const menuButton = (
    <IconButton onClick={handleDrawerOpen}>
      <Menu />
    </IconButton>
  );
  const historyTools = (
    <HistoryTools>
      <Tooltip title="Navigate back">
        <span>
          <IconButton onClick={handleGoBack} disabled={lengthOfPast <= 0}>
            <ArrowBack />
          </IconButton>
        </span>
      </Tooltip>
      <LastVisitedNotes />
      <Tooltip title="Navigate forward">
        <span>
          <IconButton onClick={handleGoForward} disabled={lengthOfFuture <= 0}>
            <ArrowForward />
          </IconButton>
        </span>
      </Tooltip>
    </HistoryTools>
  );

  return (
    <>
      {!isMobileLayout && (
        <CustomDesktopAppBar display="flex" alignItems="center">
          <TitleLine>
            <TooltipWithShortcut
              title="Back to homepage"
              shortcut={SHORTCUTS.HOME_PAGE}
              adjustVerticalDistance={-20}
            >
              <TitleLink to="/">Structure</TitleLink>
            </TooltipWithShortcut>{' '}
            {historyTools}
            {addNoteFab}
          </TitleLine>
          {drawerNavigationItems && (
            <Box sx={{ marginLeft: 'auto' }}>{menuButton}</Box>
          )}
        </CustomDesktopAppBar>
      )}
      {drawerNavigationItems && (
        <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
          <List>
            {drawerNavigationItems.map(({ label, path, icon }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton component={Link} to={path}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{label}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
      {isMobileLayout && (
        <AppBar
          position="fixed"
          sx={{
            top: 'auto',
            bottom: 0,
          }}
        >
          <Toolbar
            sx={{
              paddingBottom: 'env(safe-area-inset-bottom)',
              minHeight: 'calc(56px + env(safe-area-inset-bottom))',
            }}
          >
            <IconButton component={Link} to={'/'}>
              <Home />
            </IconButton>
            {historyTools}
            {addNoteFab}
            <Box sx={{ flexGrow: 1 }} />
            {menuButton}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default React.memo(Navigation);
