import React from "react";
import { Container, Link, Box } from "@material-ui/core";
import classNames from "classnames";
import styles from "./style";
import { useLayoutState } from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";

export default function Footer(props) {
  // global
  var { isSidebarOpened } = useLayoutState();
  var { isAuthenticated } = useUserState();

  const classes = styles();
  return (
    <Box className={classNames(classes.footer, {
        [classes.drawerOpened]: isAuthenticated && isSidebarOpened,
        [classes.drawerClosed]: isAuthenticated && !isSidebarOpened,
      })}>
      <Container maxWidth="sm">
        Copyright &copy;&nbsp;
        <Link href="#" target="_blank">
          Mini Online Market
      </Link>
        &nbsp;{new Date().getFullYear()}
      </Container>
    </Box>
  );
}
