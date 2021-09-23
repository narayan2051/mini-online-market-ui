import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  root: {
    position: "relative",
    display: "inline-block",
  },
  top: {
    color: theme.palette.primary
  },
  bottom: {
    color: theme.palette.primary[200],
    position: "absolute",
    left: 0,
  },
  backdrop: {
    zIndex: theme.zIndex.tooltip + 1,
    background: "rgba(0, 0, 0, 0.75)"
  },
  progressBar: {
    color: theme.palette.grey[100]
  }
}));
export default styles;