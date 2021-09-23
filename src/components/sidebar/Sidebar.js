import { Drawer, List } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
// context
import { useLayoutState } from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";
import { ROLE_ADMIN, ROLE_SELLER, ROLE_USER, SIDEBAR_OPENED } from "../../utils/constants";
import { ADMIN_SIDEBAR_LINKS, SELLER_SIDEBAR_LINKS, USER_SIDEBAR_LINKS } from "./helpers/SidebarItems";
import SidebarLink from "./helpers/SidebarLink/SidebarLink";
import styles from "./style";

function Sidebar({ location }) {
  const classes = styles();

  // global
  var { isSidebarOpened } = useLayoutState();
  var { userRole } = useUserState();
  const IS_SIDEBAR_OPENED = localStorage.getItem(SIDEBAR_OPENED);
  if (IS_SIDEBAR_OPENED) {
    isSidebarOpened = IS_SIDEBAR_OPENED !== "false";
  }

  // local
  let sidebarLinks = "";

  if (userRole === ROLE_ADMIN) {
    sidebarLinks = ADMIN_SIDEBAR_LINKS;
  }
  if (userRole === ROLE_USER) {
    sidebarLinks = USER_SIDEBAR_LINKS;
  }
  if (userRole === ROLE_SELLER) {
    sidebarLinks = SELLER_SIDEBAR_LINKS;
  }
  console.log(sidebarLinks)
  

  return (
    // TODO: Sandeep - Get links from components/left-sidebar/helpers/sidebarItems.js and attach them dynamically.
    // TODO: Sandeep - Add dynamic variant based on the device width. i.e, for mobile devices use variant="temporary"
    <Drawer
      variant="permanent"
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <List className={classes.sidebarList}>
        {sidebarLinks.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
