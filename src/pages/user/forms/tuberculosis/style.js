import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
    position: "relative"
  },
  dateRangeContainer: {
    "& .MuiTypography-subtitle2": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
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
  duringTreatmentDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(2),
    },
  },
  subTitleWithHelpIcon: {
    display: "flex",
    alignItems: "center",
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  familyDetailsContainer: {
    paddingTop: theme.spacing(2),
    position: "relative"
  },
  removeFamilyDetailsContainer: {
    position: "absolute",
    right: "-8px",
    top: "-8px",
    color: theme.palette.secondary.main,
  },
  addFamilyDetailsBtnContainer: {
    paddingTop: theme.spacing(1),
  },
}));
export default styles;