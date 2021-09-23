import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
    position: "relative",
  },
  subTitle: {
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  volunteerSelectContainer: {
    minWidth: "264px",
  },
  helpIcon: {
    marginLeft: theme.spacing(.5),
    marginRight: theme.spacing(.5),
    color: theme.palette.text.secondary,
  },
}));
export default styles;