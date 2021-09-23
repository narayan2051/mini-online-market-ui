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
  },
  replaceWithNepaliDigit(number) {
    var numbers = {
      0: '०',
      1: '१',
      2: '२',
      3: '३',
      4: '४',
      5: '५',
      6: '६',
      7: '७',
      8: '८',
      9: '९'
    };
    var arrNumNepali = number.toString().split('').map(function (char) {
      if (isNaN(parseInt(char))) {
        return char
      }
      return numbers[Number(char)];
    });
    return arrNumNepali.join('');
  },
};
