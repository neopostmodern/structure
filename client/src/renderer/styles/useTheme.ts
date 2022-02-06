import { createTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { baseFont } from './constants';

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        typography: {
          fontFamily: baseFont,
        },
      }),
    [prefersDarkMode]
  );
};

export default useTheme;
