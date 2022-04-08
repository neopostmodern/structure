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

const headerTypographyDefaults = {
  fontFamily: baseFont,
  fontWeight: 400,
};

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return useMemo(() => {
    const theme = createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        neutral: null as any,
        primary: {
          main: prefersDarkMode ? '#fff' : '#000',
        },
      },
      typography: {
        fontFamily: baseFont,
        h1: {
          fontSize: '3rem',
          ...headerTypographyDefaults,
        },
        h2: {
          fontSize: '2.2rem',
          ...headerTypographyDefaults,
        },
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
        MuiLink: {
          styleOverrides: {
            underlineAlways: {
              textDecorationThickness: '0.15em',
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              backgroundColor: prefersDarkMode ? undefined : '#ededed',
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
