import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
  },
  dateRangeContainer: {
    "& .MuiTypography-subtitle2": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }
}));
export default styles;