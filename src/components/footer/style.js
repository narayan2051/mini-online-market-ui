import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles(theme => ({
  root: {
    display: "flex",

  },
  footer: {
    textAlign: "center",
    padding: "20px 5px",
    backgroundColor: "#fff",
    borderTop: "1px solid #f5f5f5",
  },
  drawerOpened: {
    width: `calc(100vw - 260px)`,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    float: "right",
  },
  drawerClosed: {
    width: `calc(100vw - 66px)`,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    float: "right",
  }
}));

export default styles;