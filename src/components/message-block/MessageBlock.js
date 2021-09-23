import { Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import styles from "./style";

export default function MessageBlock(props) {
  const classes = styles();
  return (
    <Box display="flex" alignItems="center" justifyContent="center" className={classes.root}>
      <Typography variant={props.variant} color={props.color}>
        {props.text}
      </Typography>
    </Box>
  );
}

MessageBlock.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
};

MessageBlock.defaultProps = {
  color: "textSecondary",
  variant: "body1",
};