import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
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
  pregnancyServiceDetailsContainer: {
    "& .MuiTypography-subtitle2": {
      borderBottom: "1px solid " + theme.palette.divider,
      marginBottom: theme.spacing(2),
    },
  },
}));
export default styles;