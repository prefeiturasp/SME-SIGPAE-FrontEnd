import {
  API_URL,
  CES_TOKEN,
  CES_URL,
  ENVIRONMENT,
  HOME,
  JWT_AUTH,
  REFRESH_TOKEN_TIMEOUT,
  USER_URL,
} from "../config";

describe("constants/config", () => {
  afterEach(() => {
    jest.resetModules();
    jest.doMock("src/constants/viteEnv", () => ({
      viteEnv: {
        MODE: "test",
        VITE_API_URL: "http://localhost:8000",
        VITE_REFRESH_TOKEN_TIMEOUT: 3000,
        HOME: "/",
      },
    }));
  });

  it("carrega os valores do modo de teste", () => {
    expect(API_URL).toEqual("http://localhost:8000");
    expect(JWT_AUTH).toEqual("http://localhost:8000/login/");
    expect(USER_URL).toEqual("http://localhost:8000/users/");
    expect(ENVIRONMENT).toEqual("test");
    expect(HOME).toEqual("/");
    expect(CES_URL).toEqual("CES_URL_REPLACE_ME");
    expect(CES_TOKEN).toEqual("CES_TOKEN_REPLACE_ME");
    expect(REFRESH_TOKEN_TIMEOUT).toEqual(3000);
  });

  it("usa as variáveis do Vite no modo de desenvolvimento", () => {
    jest.doMock("src/constants/viteEnv", () => ({
      viteEnv: {
        MODE: "development",
        VITE_API_URL: "http://api.dev",
        VITE_CES_URL: "http://ces.dev",
        VITE_CES_TOKEN: "token-dev",
        VITE_REFRESH_TOKEN_TIMEOUT: 5000,
      },
    }));

    const config = require("../config");

    expect(config.API_URL).toEqual("http://api.dev");
    expect(config.JWT_AUTH).toEqual("http://api.dev/login/");
    expect(config.USER_URL).toEqual("http://api.dev/users/");
    expect(config.ENVIRONMENT).toEqual("development");
    expect(config.HOME).toEqual("/");
    expect(config.CES_URL).toEqual("http://ces.dev");
    expect(config.CES_TOKEN).toEqual("token-dev");
    expect(config.REFRESH_TOKEN_TIMEOUT).toEqual(5000);
  });

  it("mantém os placeholders do deploy em produção", () => {
    jest.doMock("src/constants/viteEnv", () => ({
      viteEnv: { MODE: "production" },
    }));

    const config = require("../config");

    expect(config.API_URL).toEqual("API_URL_REPLACE_ME");
    expect(config.JWT_AUTH).toEqual("API_URL_REPLACE_ME/login/");
    expect(config.USER_URL).toEqual("API_URL_REPLACE_ME/users/");
    expect(config.ENVIRONMENT).toEqual("NODE_ENV_REPLACE_ME");
    expect(config.CES_URL).toEqual("CES_URL_REPLACE_ME");
    expect(config.CES_TOKEN).toEqual("CES_TOKEN_REPLACE_ME");
    expect(config.HOME).toEqual("/");
    expect(config.REFRESH_TOKEN_TIMEOUT).toEqual(3000);
  });
});
