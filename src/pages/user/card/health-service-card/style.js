import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  logoWidth: {
    width: "100px",
  },
  printIcon: {
    display: "flex",
    justifyContent: "flex-end",
    margin: theme.spacing(2)
  }
}));
export default styles;