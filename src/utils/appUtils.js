import { REMEMBER_ME, USER_ROLE } from "../utils/constants/index";
import { Cookies } from "../utils/storage/cookies";
import { LocalStorage } from "./storage/localStorage";
import { SessionStorage } from "./storage/sessionStorage";

export const AppUtils = {
  getUserRole() {
    return Cookies.readCookie(USER_ROLE);
  },
  removeUserRef() {
    Cookies.deleteCookie(USER_ROLE);
    Cookies.deleteCookie("auth");
    Cookies.deleteCookie(REMEMBER_ME);
    SessionStorage.clear();
    LocalStorage.clear();
  },
  getUrlParam(key) {
    let pageUrl = window.location.search.substring(1);
    let urlParams = pageUrl.split("&");

    for (let i = 0; i < urlParams.length; i++) {
      let paramName = urlParams[i].split("=");

      if (paramName[0] === key) {
        return paramName[1] === undefined
          ? true
          : decodeURIComponent(paramName[1]);
      }
    }
  }
};
