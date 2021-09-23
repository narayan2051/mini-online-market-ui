import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  Backup,
  ExitToApp as LogOutIcon,
  Menu as MenuIcon,
  Person as AccountIcon,
  Settings as SettingIcon,
  ShoppingBasketOutlined,
} from "@material-ui/icons";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import HTTPClient from "../../api/api";
import  { API_URL } from "../../api/api";
import logo from "../../assets/img/logo.png";
import { useCartDispatch, useCartState } from "../../context/CartContext";
// context
import { toggleSidebar, useLayoutDispatch } from "../../context/LayoutContext";
import { useUserDispatch } from "../../context/UserContext";
import { AppUtils } from "../../utils/appUtils";
import {
  LOGOUT_SUCCESS,
  ROLE_ADMIN,
  ROLE_USER,
  SOMETHING_WENT_WRONG,
  USER_INFO,
} from "../../utils/constants";
import { SessionStorage } from "../../utils/storage/sessionStorage";
import styles from "./style";
import { Link } from "react-router-dom";

export default function Header(props) {
  const [userFullName, setUserFullName] = useState("Online Mini Market");
  const userInfo = SessionStorage.getItem(USER_INFO);

  const classes = styles();
  let history = useHistory();

  // global
  var layoutDispatch = useLayoutDispatch();
  var userDispatch = useUserDispatch();
  var cartDispatch = useCartDispatch();
  var { basket } = useCartState();


  // local
  var [profileMenu, setProfileMenu] = useState(null);

  const getUserInfo = () => {
    HTTPClient.get(API_URL.user)
      .then((response) => {
        if (response.data) {
          SessionStorage.setItem(USER_INFO, response.data);
          setUserFullName(response.data.fullName);
        }
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    userInfo ? setUserFullName(userInfo.fullName) : getUserInfo();
  }, [userInfo]);

  const logOut = () => {
    AppUtils.removeUserRef();
    userDispatch({ type: LOGOUT_SUCCESS });
    history.push("/");
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse
          )}
        >
          <MenuIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>

        <img src={logo} alt="MOM" width="36"></img>
        <Typography variant="h6" className={classes.brand}>
          Online Mini Market
        </Typography>
        <Box
          display="flex"
          className={classes.userProfileMenu}
          justifyContent="center"
          alignItems="center"
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <Typography variant="body2" className={classes.username}>
            {userFullName}
          </Typography>
          <Avatar alt="Avatar" src={logo} />
        </Box>

        <Link to="checkout">
          <div className="header__optionBasket">
            <ShoppingBasketOutlined className="" />
            <span className="header__optionLineTwo header__basketCount">{basket && basket.length}</span>
          </div>
        </Link>

        <Menu
          anchorEl={profileMenu}
          open={Boolean(profileMenu)}
          onClose={() => setProfileMenu(null)}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <MenuItem className={classes.profileMenuItem}>
            <Link
              href="profile"
              variant="body1"
              className={classes.profileMenuLink}
            >
              <AccountIcon className={classes.profileMenuIcon} />
              Profile
            </Link>
          </MenuItem>
          {userInfo &&
            (userInfo.role === ROLE_USER || userInfo.role === ROLE_ADMIN) && (
              <MenuItem className={classes.profileMenuItem}>
                <Link
                  href="setting"
                  variant="body1"
                  className={classes.profileMenuLink}
                >
                  <SettingIcon className={classes.profileMenuIcon} />
                  Setting
                </Link>
              </MenuItem>
            )}

          <MenuItem className={classes.profileMenuItem}>
            <Link
              onClick={logOut}
              variant="body1"
              className={classes.profileMenuLink}
            >
              <LogOutIcon className={classes.profileMenuIcon} />
              Logout
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
