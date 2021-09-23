
import { CircularProgress, Backdrop } from '@material-ui/core';
import React from 'react';
import styles from "./style";

export const FullBodyLoader = (props) => {
  const classes = styles();
  return (
    <Backdrop className={classes.backdrop} open={props.loading}>
      <CircularProgress className={classes.progressBar} color="inherit" />
    </Backdrop>
  );
}

export default function Spinner(props) {
  const classes = styles();
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        value={100}
        className={classes.top}
        size={24}
        thickness={5}
        {...props}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.bottom}
        size={24}
        thickness={5}
        {...props}
      />
    </div>
  );
}