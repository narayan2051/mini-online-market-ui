import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
  },
  dateRangeContainer: {
    "& .MuiTypography-subtitle2": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      fontSize: "0.75rem"
    }
  },
  subTitle: {
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  vitaminADetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    },
  },
  schoolWormDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    },
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));
export default styles;