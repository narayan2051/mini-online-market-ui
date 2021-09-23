import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
  },
  subTitle: {
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  divider: {
    margin: theme.spacing(1),
  },
}));
export default styles;