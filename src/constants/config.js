/* eslint-disable */

let API_URL = "API_URL_REPLACE_ME";
let JWT_AUTH = "API_URL_REPLACE_ME/login/";
let USER_URL = "API_URL_REPLACE_ME/users/";
let ENVIRONMENT = "NODE_ENV_REPLACE_ME";
let CES_URL = "CES_URL_REPLACE_ME";
let CES_TOKEN = "CES_TOKEN_REPLACE_ME";
// verifica o tempo minimo para refresh do token
// se faltar 300s (5 min) para o token vencer, ele deve ser atualizado
// https://getblimp.github.io/django-rest-framework-jwt/#refresh-token
const REFRESH_TOKEN_TIMEOUT = process.env.REACT_APP_REFRESH_TOKEN_TIMEOUT;

if (process.env.NODE_ENV === "development") {
  // This way we can pass params to static files. see Dockerfile.
  // when build default env is production
  API_URL = process.env.REACT_APP_API_URL;
  ENVIRONMENT = process.env.NODE_ENV;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
  // https://github.com/prefeiturasp/SME-CES-Backend
  CES_URL = process.env.REACT_APP_CES_URL;
  CES_TOKEN = process.env.REACT_APP_CES_TOKEN;
}

if (process.env.NODE_ENV === "test") {
  API_URL = "http://localhost:8000";
  ENVIRONMENT = process.env.NODE_ENV;
  JWT_AUTH = `${API_URL}/login/`;
  USER_URL = `${API_URL}/users/`;
}

module.exports = {
  API_URL: API_URL,
  JWT_AUTH: JWT_AUTH,
  USER_URL: USER_URL,
  REFRESH_TOKEN_TIMEOUT: REFRESH_TOKEN_TIMEOUT,
  HOME: "",
  ENVIRONMENT: ENVIRONMENT,
  CES_URL: CES_URL,
  CES_TOKEN: CES_TOKEN,
};
