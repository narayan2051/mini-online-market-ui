import axios from "axios";
import { AppUtils } from "../utils/appUtils";
import { IS_SESSION_EXPIRED } from "../utils/constants";
import { SessionStorage } from "../utils/storage/sessionStorage";

export const LOCAL_CONSTANTS = {
  BASE_URL: "http://localhost:8088"
};

const BASE_URL = LOCAL_CONSTANTS.BASE_URL;

export const API_URL = {
  login: BASE_URL + "/auth",
  user: BASE_URL + "user",
};

const HTTPClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
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
