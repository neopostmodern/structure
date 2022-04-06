import { useMediaQuery } from '@mui/material';
import { breakpointDesktop } from '../styles/constants';

export const useIsDesktopLayout = () =>
  useMediaQuery(`(min-width: ${breakpointDesktop}rem)`);
