import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  link: {
    textDecoration: "none",
    padding: "10px 16px",
    display: "flex",
    borderLeft: "5px solid transparent",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[200],
    },
    "&:visited": {
      color: theme.palette.text.primary,
    },
    "&.activeLink": {
      backgroundColor: theme.palette.grey[200],
      borderLeft: "5px solid " + theme.palette.primary.main,
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "& .MuiTypography-root": {
        fontWeight: theme.typography.fontWeightMedium,
      }
    },
  },
  linkIcon: {
    minWidth: theme.spacing(4),
    alignItems: "center"
  },
  hidden: {
    display: "none",
  },
  sectionTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    height: 1,
    backgroundColor: theme.palette.grey[300]
  },
  expandIcon: {
    position: "absolute",
    right: 5,
    width: "0.8em",
    height: "0.8em",
  }
}));
