import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
    position: "relative",
  },
  subTitle: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  labelSmall: {
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(.25),
  },
  marginRight: {
    marginRight: theme.spacing(1)
  }
}));
export default styles;