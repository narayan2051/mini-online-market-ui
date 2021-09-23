import axios from "axios";
import { AppUtils } from "../utils/appUtils";
import { AUTH, IS_SESSION_EXPIRED } from "../utils/constants";
import { Cookies } from "../utils/storage/cookies";
import { SessionStorage } from "../utils/storage/sessionStorage";

export const LOCAL_CONSTANTS = {
  BASE_URL: "http://localhost:8088"
};

const BASE_URL = LOCAL_CONSTANTS.BASE_URL;
export const PUBLIC_URL = BASE_URL + "/api/public";
export const SIGNUP_URL = PUBLIC_URL + "/signup";
export const PRODUCT_URL = BASE_URL + "/api/products";
export const PRODUCT_STOCK_URL = BASE_URL + "/api/products/stock";
export const ORDER_URL = BASE_URL + "/api/orders";
export const ADMIN_USERS_URL = BASE_URL + "/api/users";
export const UPDATE_USER_STATUS= BASE_URL +"/api/users/updateUserStatus"

export const API_URL = {
  login: BASE_URL + "/auth",
  user: BASE_URL + "user",
};

const HTTPClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    auth: Cookies.readCookie(AUTH) || ""
  },
  withCredentials: true
});

// HTTPClient.interceptors.request.use(
//   config => {
//     document.body["children"].root.classList.add('body-loader');
//     return config;
//   },
//   error => Promise.reject(error)
// );

// HTTPClient.interceptors.response.use(
//   response => {
//     document.body["children"].root.classList.remove('body-loader');
//     return response;
//   },
//   error => {
//     document.body["children"].root.classList.remove('body-loader');
//     if (error.response) {
//       if (error.response.status === 401 || error.response.status === 403) {
//         AppUtils.removeUserRef();
//         SessionStorage.setItem(IS_SESSION_EXPIRED, "true");
//         window.location.href = "/";
//       }
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

export default HTTPClient;
