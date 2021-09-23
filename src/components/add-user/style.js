import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const styles = makeStyles(theme => ({
  switchLabelSmall: {
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(.25),
  },
}));
export default styles;
