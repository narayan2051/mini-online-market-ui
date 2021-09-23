import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HTTPClient, { API_URL } from "../../../api/api";
import logo from "../../../assets/img/logo.png";
import { useUserDispatch } from "../../../context/UserContext";
import {
  ENTER_VALID_EMAIL,
  IS_SESSION_EXPIRED,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  REQUIRED_FIELD,
  SESSION_EXPIRED,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_ROLE,
} from "../../../utils/constants/index";
import { Cookies } from "../../../utils/storage/cookies";
import { SessionStorage } from "../../../utils/storage/sessionStorage";
import styles from "./style";

export default function LoginForm(props) {
  const classes = styles();
  const { register, handleSubmit, errors } = useForm();

  // global
  var userDispatch = useUserDispatch();

  // local
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (SessionStorage.getItem(IS_SESSION_EXPIRED) === "true") {
      SessionStorage.removeItem(IS_SESSION_EXPIRED);
    }
  }, []);

  const onSubmit = (data) => {
    HTTPClient.post(API_URL.login, data)
      .then((response) => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          Cookies.writeCookie("auth", response.data.token);
          Cookies.writeCookie("role", response.data.role);
          let userRole = Cookies.readCookie(USER_ROLE);
          !userRole &&
            jsondata.data &&
            Cookies.writeCookie(USER_ROLE, jsondata.data, 6 * 24);
          userDispatch({ type: LOGIN_SUCCESS });
          props.history.push("/");
        } else {
          userDispatch({ type: LOGIN_FAILURE });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        userDispatch({ type: LOGIN_FAILURE });
      });
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Box textAlign="center" my={3}>
        <img src={logo} alt="MoM Logo" width="124" />
        <Box fontSize="h5.fontSize"> MOM </Box>
        <Box component="small"> Mini Online Market </Box>
      </Box>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="userEmail"
                label="Email"
                margin="normal"
                variant="outlined"
                name="username"
                inputRef={register({
                  required: true,
                  pattern: /\S+@\S+\.\S+/,
                })}
              />
              {errors.userEmail && errors.userEmail.type === "required" && (
                <span className="error-message">{REQUIRED_FIELD}</span>
              )}
              {errors.userEmail && errors.userEmail.type === "pattern" && (
                <span className="error-message">{ENTER_VALID_EMAIL}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                name="password"
                inputRef={register({
                  required: true,
                })}
              />
              {errors.password && (
                <span className="error-message">{REQUIRED_FIELD}</span>
              )}
            </Grid>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember Me"
              name="rememberMe"
              inputRef={register}
            />
            <Grid item xs={12} className={classes.loginBtnContainer}>
              {isLoading ? (
                ""
              ) : (
                <Button
                  endIcon={<ExitToAppIcon />}
                  size="large"
                  fullWidth
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Login
                </Button>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Box align="right" pt={1}>
        <Link
          href="/forget-password"
          underline="none"
          color="textSecondary"
          className={classes["forget-password-label"]}
        >
          Forget Password ?
        </Link>
      </Box>
      <Grid item xs={12} className={classes.loginBtnContainer}>
        <Button
          endIcon={<Add />}
          size="large"
          fullWidth
          color="success"
          variant="contained"
          type="submit"
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </Grid>
    </Container>
  );
}
