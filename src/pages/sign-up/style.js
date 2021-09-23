import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  loginBtnContainer: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
  signupBtnContainer: {
    marginTop: theme.spacing(4),
    textAlign: "center",
  },
}));
export default styles;
