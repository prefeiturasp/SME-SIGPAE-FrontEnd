import { viteEnv } from "./viteEnv";

export let API_URL = "API_URL_REPLACE_ME";
export let JWT_AUTH = "API_URL_REPLACE_ME/login/";
export let USER_URL = "API_URL_REPLACE_ME/users/";
export let ENVIRONMENT = "NODE_ENV_REPLACE_ME";
export let CES_URL = "CES_URL_REPLACE_ME";
export let CES_TOKEN = "CES_TOKEN_REPLACE_ME";
export let HOME = "/";

export const REFRESH_TOKEN_TIMEOUT =
  viteEnv?.VITE_REFRESH_TOKEN_TIMEOUT ?? 3000;

if (viteEnv?.MODE === "development") {
  API_URL = viteEnv.VITE_API_URL;
  ENVIRONMENT = viteEnv.MODE;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
  CES_URL = viteEnv.VITE_CES_URL;
  CES_TOKEN = viteEnv.VITE_CES_TOKEN;
  HOME = "/";
}

if (viteEnv?.MODE === "test") {
  API_URL = "http://localhost:8000";
  ENVIRONMENT = viteEnv.MODE;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
  HOME = "/";
}
