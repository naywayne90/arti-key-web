import { createTheme } from '@mui/material/styles';

// Palette de couleurs ARTI
export const artiColors = {
  blue: {
    light: '#E3F2FD',
    main: '#2196F3',
    dark: '#1976D2',
  },
  green: {
    light: '#E8F5E9',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  yellow: {
    light: '#FFF9C4',
    main: '#FFEB3B',
    dark: '#FBC02D',
  },
  orange: {
    light: '#FFF3E0',
    main: '#FF9800',
    dark: '#F57C00',
  },
  red: {
    light: '#FFEBEE',
    main: '#F44336',
    dark: '#D32F2F',
  },
};

// Création du thème personnalisé
const artiTheme = createTheme({
  palette: {
    primary: {
      light: artiColors.blue.light,
      main: artiColors.blue.main,
      dark: artiColors.blue.dark,
    },
    secondary: {
      light: artiColors.green.light,
      main: artiColors.green.main,
      dark: artiColors.green.dark,
    },
    error: {
      light: artiColors.red.light,
      main: artiColors.red.main,
      dark: artiColors.red.dark,
    },
    warning: {
      light: artiColors.orange.light,
      main: artiColors.orange.main,
      dark: artiColors.orange.dark,
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default artiTheme;
