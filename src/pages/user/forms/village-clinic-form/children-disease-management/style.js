import { makeStyles } from "@material-ui/core/styles";
const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(1),
    position: "relative",
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
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  checkboxLabelSmall: {
    fontSize: theme.typography.fontSize,
  },
  bold: {
    fontWeight: 700,
    color: theme.palette.text.primary,
  }
}));
export default styles;