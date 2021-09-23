import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2),
  },
  dateRangeContainer: {
    "& .MuiTypography-subtitle2": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  },
  lmpAndEddInfo: {
    marginBottom: theme.spacing(2)
  },
  ancDetails: {
    marginBottom: theme.spacing(2),
    position: "relative"
  },
  hivAndSyphlisDetails: {
    marginBottom: theme.spacing(2),
    position: "relative",
    "& .MuiFormControlLabel-root": {
      fontSize: "10px",
      "& .MuiFormControlLabel-label": {
        "&.MuiTypography-body1": {
          fontSize: theme.typography.fontSize,
        }
      }
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
  labelSmall: {
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(.25),
  },
  selectLeftMargin: {
    marginLeft: theme.spacing(2)
  },
  artStartedDateContainer: {
    marginLeft: theme.spacing(2),
    "& .input-group": {
      marginLeft: theme.spacing(1),
    }
  },
  pregnancyComplexityContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  placeRadioGroup: {
    flexFlow: "row",
    alignItems: "flex-start"
  },
  otherPlaceName: {
    marginLeft: theme.spacing(2),
    minWidth: theme.spacing(37)
  },
  mritaJanmaSankhya: {
    marginLeft: theme.spacing(2),
  },
  childHealthDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  pncDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  bloodDonationDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  dischargeDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  childDeathDetailsContainer: {
    position: "relative",
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  pregnancyTravelCostDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(1),
    }
  },
  aliveChildrenDetailsContainer: {
    paddingTop: theme.spacing(2),
    position: "relative"
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  removeAliveDetailsContainer: {
    position: "absolute",
    right: "-8px",
    top: "-8px",
    color: theme.palette.secondary.main,
  },
  addAliveChildDetailsContainer: {
    paddingTop: theme.spacing(1),
  },
}));
export default styles;