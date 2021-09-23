import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
    position: "relative",
  },
  tick: {
    color: "#4caf50",
  },
  customRow: {
    margin: theme.spacing(1)
  },
  tableCell: {
    paddingBottom: 0,
    paddingTop: 0,
  }
}));
export default styles;