import { makeStyles } from "@material-ui/core/styles";
import { APP_BAR_HEIGHT } from "../../utils/constants/index";
const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    height: APP_BAR_HEIGHT,
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.contrastText
  },
  brand: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
  userProfileMenu: {
    cursor: "pointer",
    height: "100%"
  },
  username: {
    paddingRight: theme.spacing(1),
  },
  profileMenu: {
    marginTop: theme.spacing(6),
    border: '1px solid #d3d4d5',
    right: "15px",
    left: "auto !important",
  },
  profileMenuIcon: {
    paddingRight: theme.spacing(1)
  },
  profileMenuLink: {
    display: "inline-flex",
    verticalAlign: "middle",
    color: theme.palette.text.secondary
  }

}));
export default styles;