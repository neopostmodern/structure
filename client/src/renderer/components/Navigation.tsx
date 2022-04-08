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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { goBack, goForward } from 'redux-first-history';
import styled, { css } from 'styled-components';
import { AdditionalNavigationItem } from '../containers/ComplexLayout';
import { RootState } from '../reducers';
import { HistoryStateType } from '../reducers/history';
import { breakpointDesktop, breakPointMobile } from '../styles/constants';
import LastVisitedNotes from './LastVisitedNotes';

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 1;
  @media (min-width: 40rem) and (max-width: ${breakpointDesktop - 0.001}rem) {
    flex: unset;
    width: calc(50% + 32px);
    min-width: 25rem;
  }
`;

const TitleLink = styled(Link)`
  font-size: 2.5rem;
  font-weight: bold;
  color: inherit;

  &:not(:hover) {
    text-decoration: none;
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

  const addNoteFab = (
    <Tooltip title="Add new note">
      <ResponsiveFab
        centered={isMobileLayout}
        color="primary"
        aria-label="add"
        component={Link}
        to="/notes/add"
      >
        <Add fontSize="large" />
      </ResponsiveFab>
    </Tooltip>
  );
  const menuButton = (
    <IconButton onClick={() => setIsDrawerOpen(true)}>
      <Menu />
    </IconButton>
  );
  const historyTools = (
    <HistoryTools>
      <Tooltip title="Navigate back">
        <span>
          <IconButton
            onClick={() => dispatch(goBack())}
            disabled={lengthOfPast <= 0}
          >
            <ArrowBack />
          </IconButton>
        </span>
      </Tooltip>
      <LastVisitedNotes />
      <Tooltip title="Navigate forward">
        <span>
          <IconButton
            onClick={() => dispatch(goForward())}
            disabled={lengthOfFuture <= 0}
          >
            <ArrowForward />
          </IconButton>
        </span>
      </Tooltip>
    </HistoryTools>
  );

  return (
    <>
      {!isMobileLayout && (
        <Box display="flex" alignItems="center">
          <TitleLine>
            <Tooltip title="Back to homepage">
              <TitleLink to="/">Structure</TitleLink>
            </Tooltip>{' '}
            {historyTools}
            {addNoteFab}
          </TitleLine>
          {drawerNavigationItems && (
            <Box sx={{ marginLeft: 'auto' }}>{menuButton}</Box>
          )}
        </Box>
      )}
      {drawerNavigationItems && (
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
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
        <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
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

export default Navigation;
