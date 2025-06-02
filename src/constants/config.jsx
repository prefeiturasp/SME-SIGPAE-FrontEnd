/* eslint-disable */

export let API_URL = "API_URL_REPLACE_ME";
export let JWT_AUTH = "API_URL_REPLACE_ME/login/";
export let USER_URL = "API_URL_REPLACE_ME/users/";
export let ENVIRONMENT = "NODE_ENV_REPLACE_ME";
export let CES_URL = "CES_URL_REPLACE_ME";
export let CES_TOKEN = "CES_TOKEN_REPLACE_ME";
export let HOME = "/";

export const REFRESH_TOKEN_TIMEOUT = import.meta.env.VITE_REFRESH_TOKEN_TIMEOUT;

if (import.meta.env.MODE === "development") {
  API_URL = import.meta.env.VITE_API_URL;
  ENVIRONMENT = import.meta.env.MODE;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
  CES_URL = import.meta.env.VITE_CES_URL;
  CES_TOKEN = import.meta.env.VITE_CES_TOKEN;
  HOME = "/";
}

if (import.meta.env.MODE === "test") {
  API_URL = "http://localhost:8000";
  ENVIRONMENT = import.meta.env.MODE;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
  HOME = "/";
}
