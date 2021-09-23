import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  btnContainer: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderColor: "rgba(48, 48, 48, 0.5)",
  },
  resetBtn: {
    marginRight: theme.spacing(1)
  }
}));
export default styles;