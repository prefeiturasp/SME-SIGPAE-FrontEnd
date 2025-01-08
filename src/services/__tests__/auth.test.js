import authService, {
  calculateTokenSecondsLeft,
  isTokenExpired,
  TOKEN_ALIAS,
} from "../auth";

if (typeof localStorage === "undefined" || localStorage === null) {
  let LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch"); // eslint-disable-line
}

const expiredToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im1tYWlhLmNjQGdtYWlsLmNvbSIsImV4cCI6MTU1ODAxOTU3OSwiZW1haWwiOiJtbWFpYS5jY0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU1ODAxNTk3OX0.1dd6FpIpKagM5K6Qk8PL499oHi9PCrcoAGRJOqKeBf8";
const nonExpiredToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im1tYWlhLmNjQGdtYWlsLmNvbSIsImV4cCI6MTU1ODAzMTA4NiwiZW1haWwiOiJtbWFpYS5jY0BnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTU1ODAyNzQ4Nn0.V65suJw4LACKhQMNltbi7emIlmxGsYP4VHhEK83O8EU";
localStorage.setItem(TOKEN_ALIAS, expiredToken);
const mock = jest.fn();
Date.now = mock.mockReturnValue(1558020115077);

describe("AuthService isValidResponse", () => {
  it("Should not pass plain undefined", () => {
    const resp = authService.isValidResponse({ token: undefined });
    expect(resp).toBe(false);
  });

  it("Should not pass plain string", () => {
    const resp = authService.isValidResponse(expiredToken);
    expect(resp).toBe(false);
  });
});

describe("AuthService Helper functions", () => {
  it("should return true on isLoggedIn", () => {
    const resp = authService.isLoggedIn();
    expect(resp).toBe(true);
  });

  it("should return false on isLoggedIn after remove localstorage token", () => {
    localStorage.removeItem(TOKEN_ALIAS);
    const resp = authService.isLoggedIn();
    expect(resp).toBe(false);
  });

  it("should return correct seconds", () => {
    const mock = jest.fn();
    Date.now = mock.mockReturnValue(1558020115077);
    const resp = calculateTokenSecondsLeft(expiredToken);
    expect(resp).toBe(-536.077);
  });
  it("isTokenExpired should return true when expired", () => {
    const mock = jest.fn();
    Date.now = mock.mockReturnValue(1558020115077);
    const resp = isTokenExpired(expiredToken);
    expect(resp).toBe(true);
  });
  it("isTokenExpired should return false when non expired", () => {
    const resp = isTokenExpired(nonExpiredToken);
    expect(resp).toBe(false);
  });
  it("isTokenExpired should return true when undefined", () => {
    const resp = isTokenExpired(undefined);
    expect(resp).toBe(true);
  });
  it("isTokenExpired should return true when null", () => {
    const resp = isTokenExpired(null);
    expect(resp).toBe(true);
  });
});
