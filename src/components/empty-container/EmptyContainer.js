import { Box } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

export default function EmptyContainer({ children, ...props }) {
  return (
    <Box className={props.className} height={props.height} display={props.display} alignItems={props.alignItems} justifyContent={props.justifyContent}>
      {children}
    </Box>
  );
}
EmptyContainer.propTypes = {
  height: PropTypes.number,
  display: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  className: PropTypes.string
};

EmptyContainer.defaultProps = {
  height: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  className: "emptyContainer"
};