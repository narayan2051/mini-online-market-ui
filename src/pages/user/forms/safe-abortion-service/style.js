import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
    position: "relative",
  },
  dateRangeContainer: {
    "& .MuiTypography-subtitle2": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
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
  abortionClientDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    },
  },
  checkboxLabelSmall: {
    fontSize: theme.typography.fontSize,
  },
  radioLabelSmall: {
    fontSize: theme.typography.fontSize,
  },
}));
export default styles;