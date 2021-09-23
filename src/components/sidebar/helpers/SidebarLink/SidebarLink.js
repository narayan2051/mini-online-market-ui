import { Collapse, Divider, List, ListItem, ListItemIcon, Typography } from "@material-ui/core";
import { ExpandMore, FiberManualRecord as FiberManualRecordIcon } from "@material-ui/icons";
import classnames from "classnames";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
// styles
import useStyles from "./styles";

export default function SidebarLink({
  link,
  iconComponent,
  label,
  children,
  location,
  isSidebarOpened,
  type,
}) {
  var classes = useStyles();

  // local
  var [isOpen, setIsOpen] = useState(false);

  if (type === "title") {
    return (
      <Typography
        variant="body2"
        className={classnames(classes.linkTitle, classes.sectionTitle, {
          [classes.hidden]: !isSidebarOpened,
        })}
      >
        {label}
      </Typography>
    );
  }

  if (type === "divider") {
    return <Divider className={classes.divider} />;
  }

  if (!children) {
    return (
      <NavLink
        to={link}
        activeClassName="activeLink"
        className={classes.link}
      >
        <ListItemIcon
          classes={{
            root: classes.linkIcon,
          }}
        >
          {iconComponent}
        </ListItemIcon>
        <Typography
          variant="body2"
          className={classnames(classes.linkText, {
            [classes.hidden]: !isSidebarOpened,
          })}
        >
          {label}
        </Typography>
      </NavLink>
    );
  }
  return (
    <div>
      <ListItem
        button
        component={link && Link}
        onClick={toggleCollapse}
        className={classes.link}
        to={link}
        disableRipple
      >
        <ListItemIcon
          classes={{
            root: classes.linkIcon,
          }}
        >
          {iconComponent ? iconComponent : <FiberManualRecordIcon />}
        </ListItemIcon>
        <Typography
          variant="body2"
          className={classnames(classes.linkText, {
            [classes.hidden]: !isSidebarOpened,
          })}
        >
          {label}
        </Typography>
        <ExpandMore
          className={classnames(classes.expandIcon, {
            [classes.hidden]: !isSidebarOpened,
          })}
        />
      </ListItem>
      {children && (
        <Collapse
          in={isOpen && isSidebarOpened}
          timeout="auto"
          unmountOnExit
          className={classes.nestedList}
        >
          <List component="div" disablePadding>
            {children.map((childrenLink, index) => (
              <SidebarLink
                key={index}
                location={location}
                isSidebarOpened={isSidebarOpened}
                classes={classes}
                {...childrenLink}
              />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );

  function toggleCollapse(e) {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
}
