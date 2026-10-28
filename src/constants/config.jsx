import { viteEnv } from "./viteEnv";

function definirConfiguracao() {
  if (viteEnv?.MODE === "development") {
    const apiUrl = viteEnv.VITE_API_URL;
    return {
      API_URL: apiUrl,
      JWT_AUTH: `${apiUrl}/login/`,
      USER_URL: `${apiUrl}/users/`,
      ENVIRONMENT: viteEnv.MODE,
      CES_URL: viteEnv.VITE_CES_URL,
      CES_TOKEN: viteEnv.VITE_CES_TOKEN,
      HOME: "/",
    };
  }
  if (viteEnv?.MODE === "test") {
    const apiUrl = "http://localhost:8000";
    return {
      API_URL: apiUrl,
      JWT_AUTH: `${apiUrl}/login/`,
      USER_URL: `${apiUrl}/users/`,
      ENVIRONMENT: viteEnv.MODE,
      CES_URL: "CES_URL_REPLACE_ME",
      CES_TOKEN: "CES_TOKEN_REPLACE_ME",
      HOME: "/",
    };
  }
  return {
    API_URL: "API_URL_REPLACE_ME",
    JWT_AUTH: "API_URL_REPLACE_ME/login/",
    USER_URL: "API_URL_REPLACE_ME/users/",
    ENVIRONMENT: "NODE_ENV_REPLACE_ME",
    CES_URL: "CES_URL_REPLACE_ME",
    CES_TOKEN: "CES_TOKEN_REPLACE_ME",
    HOME: "/",
  };
}

const configuracao = definirConfiguracao();

export const API_URL = configuracao.API_URL;
export const JWT_AUTH = configuracao.JWT_AUTH;
export const USER_URL = configuracao.USER_URL;
export const ENVIRONMENT = configuracao.ENVIRONMENT;
export const CES_URL = configuracao.CES_URL;
export const CES_TOKEN = configuracao.CES_TOKEN;
export const HOME = configuracao.HOME;

export const REFRESH_TOKEN_TIMEOUT =
  viteEnv?.VITE_REFRESH_TOKEN_TIMEOUT ?? 3000;
