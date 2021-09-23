import { amber, blue, green, indigo, red } from "@material-ui/core/colors";

export default {
  palette: {
    primary: {
      50: indigo[50],
      100: indigo[100],
      200: indigo[200],
      300: indigo[300],
      400: indigo[400],
      500: indigo[500],
      600: indigo[600],
      700: indigo[700],
      800: indigo[800],
      900: indigo[900],
      A100: indigo.A100,
      A200: indigo.A200,
      A400: indigo.A400,
      A700: indigo.A700,
    },
    secondary: {
      main: red.A700,
      light: red[700],
      dark: red[900]
    },
    info: {
      main: blue[500],
      light: blue[300],
      dark: blue[700]
    },
    success: {
      main: green[500],
      light: green[300],
      dark: green[700]
    },
    warning: {
      main: amber[500],
      light: amber[300],
      dark: amber[700]
    },
    text: {
      info: blue[700],
      success: green[700],
      warning: amber[700],
      error: red[700],
    },
    background: {
      info: blue[700],
      success: green[700],
      warning: amber[700],
      error: red[700]
    }
  },
  overrides: {
    MuiButton: {
      sizeLarge: {
        minHeight: "52px",
      }
    },
    MuiTextField: {
      root: {
        marginRight: "8px",
        '&:last-child': {
          marginRight: "0",
        }
      }
    },
  },
};
