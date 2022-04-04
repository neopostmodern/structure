import { createTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { baseFont } from './constants';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
  interface PaletteColor {
    neutral?: string;
  }
  interface SimplePaletteColorOptions {
    neutral?: string;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    huge: true;
  }
}

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return useMemo(() => {
    const theme = createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        neutral: null as any,
      },
      typography: {
        fontFamily: baseFont,
        button: {
          textTransform: 'unset',
        },
      },
      components: {
        MuiButton: {
          defaultProps: {
            color: 'neutral',
          },
          styleOverrides: {
            sizeHuge: {
              fontSize: '1.25rem',
            },
          },
        },
      },
    });
    return createTheme(theme, {
      palette: {
        neutral: {
          main: theme.palette.text.primary,
          contrastText: 'white',
        },
      },
    });
  }, [prefersDarkMode]);
};

export default useTheme;
