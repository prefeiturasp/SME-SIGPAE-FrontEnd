import axios from "axios";
import authService, { TOKEN_ALIAS } from "./auth";
import { API_URL } from "../constants/config";
import { StatusCodes } from "http-status-codes";

const api = axios.create({
  baseURL: API_URL,
});

export const apiLoggedOut = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(function (config) {
  if (config.url.includes("/media/")) return config;
  if (!config.url.endsWith("/")) {
    throw new Error(
      "URLs devem obrigatoriamente terminar em '/': " + config.url
    );
  }
  return config;
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_ALIAS);
    if (token) {
      config.headers.Authorization = `JWT ${localStorage.getItem(TOKEN_ALIAS)}`;
      if (authService.needsToRefreshToken(token)) {
        const response = await authService.refreshToken();
        if (response.status === StatusCodes.OK) {
          localStorage.setItem(TOKEN_ALIAS, response.data.access);
          config.headers.Authorization = `Bearer ${response.data.access}`;
        } else {
          authService.logout();
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAndRetryQueue = [];

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest && originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (
      authService.isLoggedIn() &&
      error.response &&
      error.response.status === 401
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await authService.refreshToken();
          if (newAccessToken.status !== StatusCodes.OK) {
            authService.logout();
          }
          error.config.headers[
            "Authorization"
          ] = `JWT ${newAccessToken.data.access}`;

          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            api
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });

          refreshAndRetryQueue.length = 0;

          return api(originalRequest);
        } catch (refreshError) {
          authService.logout();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    // Return a Promise rejection if the status code is not 401
    return Promise.reject(error);
  }
);

export default api;
