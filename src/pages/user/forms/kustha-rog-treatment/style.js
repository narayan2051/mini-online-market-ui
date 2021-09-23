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
  labelSmall: {
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(.25),
  },
  subTitle: {
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  treatmentDetailsContainer: {
    paddingTop: theme.spacing(2),
    position: "relative"
  },
  removeTreatmentDetailsContainer: {
    position: "absolute",
    right: "-8px",
    top: "-8px",
    color: theme.palette.secondary.main,
  },
  addTreatmentDetailsBtnContainer: {
    paddingTop: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
}));
export default styles;