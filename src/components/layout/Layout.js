import classnames from "classnames";
import React from "react";
// context
import { useLayoutState } from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
// styles
import styles from "./styles";

function Layout(props) {
  var classes = styles();

  // global
  var layoutState = useLayoutState();
  var { isAuthenticated } = useUserState();

  const mainContent = isAuthenticated ? (
    <main className={classnames(classes.content, {
      [classes.contentShift]: layoutState.isSidebarOpened
    })}>
      <div className={classes.fakeToolbar} />
      {props.children}
    </main>) : (
      <main className={classes.content}>
        {props.children}
      </main>
    );
  return (
    <div className={classes.root}>
      <>
        {isAuthenticated &&
          <>
            <Header />
            <Sidebar />
          </>
        }
        {mainContent}
      </>
    </div>
  );
}

export default Layout;
