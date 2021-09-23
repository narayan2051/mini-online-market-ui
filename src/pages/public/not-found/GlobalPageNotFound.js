import { Box, Button, Container, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React from 'react';
import styles from "./style";

export default function GlobalPageNotFound(props) {
  const classes = styles();
  return (
    <Container maxWidth="lg" className={classes.root} disableGutters>
      <Box textAlign="center">
        <Box mb={3}>
          <Typography variant="h2">Oops! Page Not Found.</Typography>
        </Box>
        <Button
          color="primary"
          onClick={() => {
            props.history.push("/");
          }}
          className={classes.button}
          startIcon={<ArrowBackIcon />}
        >
          Back To Home
      </Button>
      </Box>
    </Container>
  )
};