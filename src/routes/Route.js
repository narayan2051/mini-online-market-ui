import PropTypes from "prop-types";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useUserState } from "../context/UserContext";
import { ROLE_ADMIN, ROLE_SELLER, ROLE_USER} from "../utils/constants/index";

export default function RouteWrapper({ component: Component, path: urlPath, isPrivate, isWrongLink, ...rest }) {
  var { userRole } = useUserState();
  if (isPrivate && !userRole) {
    return <Redirect to="/" />;
  } else if (!isPrivate && !isWrongLink && !urlPath.includes("/user-not-authorized") && userRole === ROLE_ADMIN) {
    return <Redirect to="/admin/dashboard" />;
  } else if (!isPrivate && !isWrongLink && !urlPath.includes("/user-not-authorized") && userRole === ROLE_USER) {
    return <Redirect to="/user/products" />;
  } else if (!isPrivate && !isWrongLink && !urlPath.includes("/user-not-authorized") && userRole === ROLE_SELLER) {
    return <Redirect to="/seller/dashboard" />;
  } else if (isPrivate && urlPath.includes("/admin") && userRole !== ROLE_ADMIN) {
    return <Redirect to="/user-not-authorized" />;
  } else {
    return <Route {...rest} component={Component} />;
  }
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  isWrongLink: PropTypes.bool
};

RouteWrapper.defaultProps = {
  isPrivate: false,
  isWrongLink: false
};
