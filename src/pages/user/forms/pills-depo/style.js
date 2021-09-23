import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(2)
  },
  subTitle: {
    borderBottom: "1px solid " + theme.palette.divider,
    paddingBottom: theme.spacing(.5),
    marginBottom: theme.spacing(2),
    "& .MuiTypography-root": {
      color: theme.palette.text.primary
    }
  },
  pillsDepoDetailsContainer: {
    paddingTop: theme.spacing(2),
    position: "relative"
  },
  removePillsDepoDetailsContainer: {
    position: "absolute",
    right: "-8px",
    top: "-8px",
    color: theme.palette.secondary.main,
  },
  addPillsDepoDetailsBtnContainer: {
    paddingTop: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  fiscalYearSelectContainer: {
    width: theme.spacing(20),
  }
}));
export default styles;