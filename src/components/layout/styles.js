import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  root: {
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  content: {
    flexGrow: 1,
    width: `calc(100vw - 66px)`,
    minHeight: "100vh",
    padding: theme.spacing(3),
  },
  contentShift: {
    width: `calc(100vw - 260px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
}));
