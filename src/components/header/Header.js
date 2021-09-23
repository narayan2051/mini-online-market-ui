import { AppBar, Avatar, Box, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core";
import { Backup, ExitToApp as LogOutIcon, Menu as MenuIcon, Person as AccountIcon, Settings as SettingIcon } from "@material-ui/icons";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import HMIS, { API_URL } from "../../api/api";
import logo from "../../assets/img/logo.png";
// context
import { toggleSidebar, useLayoutDispatch } from "../../context/LayoutContext";
import { useUserDispatch } from "../../context/UserContext";
import { AppUtils } from "../../utils/appUtils";
import { LOGOUT_SUCCESS, ROLE_ADMIN, ROLE_USER, SOMETHING_WENT_WRONG, USER_INFO } from "../../utils/constants";
import { SessionStorage } from "../../utils/storage/sessionStorage";
import AddAlertMessage from "../alert/Alert";
import styles from "./style";

export default function Header(props) {
  const [userFullName, setUserFullName] = useState("HMIS");
  const userInfo = SessionStorage.getItem(USER_INFO);

  const classes = styles();
  let history = useHistory();

  // global
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();

  // local
  var [profileMenu, setProfileMenu] = useState(null);

  const getUserInfo = () => {
    HMIS.get(API_URL.user)
      .then(response => {
        if (response.data) {
          SessionStorage.setItem(USER_INFO, response.data);
          setUserFullName(response.data.fullName);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  useEffect(() => {
    userInfo ? setUserFullName(userInfo.fullName) : getUserInfo();
  }, [userInfo]);

  const logOut = () => {
    HMIS.post(API_URL.logOut)
      .then(response => {
        let data = response.data;
        if (data.type === "success") {
          AppUtils.removeUserRef();
          userDispatch({ type: LOGOUT_SUCCESS });
          history.push("/");
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const backupData = () => {
    HMIS.get(API_URL.user + "/db-backup")
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message })
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          <MenuIcon
            classes={{
              root: classNames(
                classes.headerIcon,
                classes.headerIconCollapse,
              ),
            }}
          />
        </IconButton>
        <img src={logo} alt="HMIS" width="36"></img>
        <Typography variant="h6" className={classes.brand}>
          HMIS
        </Typography>
        <Box display="flex" className={classes.userProfileMenu} justifyContent="center" alignItems="center" onClick={e => setProfileMenu(e.currentTarget)}>
          <Typography variant="body2" className={classes.username}>
            {userFullName}
          </Typography>
          <Avatar alt="Avatar" src={logo} />
        </Box>
        <Menu anchorEl={profileMenu} open={Boolean(profileMenu)} onClose={() => setProfileMenu(null)} classes={{ paper: classes.profileMenu }} disableAutoFocusItem>
          <MenuItem className={classes.profileMenuItem}>
            <Link href="profile" variant="body1" className={classes.profileMenuLink}>
              <AccountIcon className={classes.profileMenuIcon} />
              Profile
            </Link>
          </MenuItem>
          {
            userInfo && (userInfo.role === ROLE_USER || userInfo.role === ROLE_ADMIN) &&
            <MenuItem className={classes.profileMenuItem}>
              <Link href="setting" variant="body1" className={classes.profileMenuLink}>
                <SettingIcon className={classes.profileMenuIcon} />
              Setting
            </Link>
            </MenuItem>
          }
          {!navigator.onLine && (
            <MenuItem className={classes.profileMenuItem}>
              <Link onClick={backupData} variant="body1" className={classes.profileMenuLink}>
                <Backup className={classes.profileMenuIcon} />
              Data Backup
            </Link>
            </MenuItem>
          )}
          <MenuItem className={classes.profileMenuItem}>
            <Link onClick={logOut} variant="body1" className={classes.profileMenuLink}>
              <LogOutIcon className={classes.profileMenuIcon} />
              Logout
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
