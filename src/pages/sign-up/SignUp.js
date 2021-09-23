import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { InputLabel, MenuItem, Select } from "@mui/material";
import HTTPClient, { SIGNUP_URL } from "../../api/api";
const theme = createTheme();

export default function SignUp(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    HTTPClient.post(SIGNUP_URL, data)
      .then((response) => {
        props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    register({ name: "role" });
  }, []);

  const handleChange = (e) => {
    setValue("role", e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputRef={register({ required: true })}
                />
                <p id="error">{errors.firstName?.message}</p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  inputRef={register({ required: true })}
                />
                <p id="error">{errors.lastName?.message}</p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={register({ required: true })}
                />
                <p id="error">{errors.email?.message}</p>
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="role"
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Select Role">Select Role</MenuItem>
                  <MenuItem value="SELLER">Seller</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputRef={register({ required: true })}
                />
                <p id="error">{errors.password?.message}</p>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
