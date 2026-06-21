import { createTheme, type ThemeOptions } from "@mui/material/styles";

/**
 * Lilac accent palette — soft violet/purple shades.
 * Mapped from the design-system lilac scale into MUI's primary colour slot.
 */
const lilac = {
  50: "#f6f4ff",
  100: "#ece8ff",
  200: "#dacfff",
  300: "#c1acff",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95",
  950: "#2e1065",
} as const;

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: lilac[600],
      light: lilac[400],
      dark: lilac[800],
      contrastText: "#ffffff",
    },
    secondary: {
      main: lilac[500],
      light: lilac[300],
      dark: lilac[700],
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    success: { main: "#16a34a" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    info: { main: "#2563eb" },
  },
  typography: {
    fontFamily:
      'Inter, "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
        sizeLarge: { padding: "10px 24px" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #e2e8f0",
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "transparent" },
    },
  },
};

export const theme = createTheme(themeOptions);
