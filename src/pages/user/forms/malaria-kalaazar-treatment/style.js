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
  treatmentAndCounselingDetails: {
    marginBottom: theme.spacing(1),
  },
  tick: {
    color: "#4caf50",
  },
  customRow: {
    margin: theme.spacing(1)
  },
  chip: {
    margin: theme.spacing(.3)
  },
  registerTypeSelect: {
    width: theme.spacing(15)
  }
}));
export default styles;