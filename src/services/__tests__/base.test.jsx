import mock from "../_mock";

import { API_URL } from "../../constants/config";
import { TOKEN_ALIAS } from "../constants";
import axios from "../_base";

beforeEach(() => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === TOKEN_ALIAS) {
      return "mocked-token"; // Return a mocked token
    }
    return null;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("test getAxios", () => {
  it("requer URL terminando em '/'", async () => {
    await axios.get("endpoint").catch((error) => {
      expect(error.message).toEqual(
        "URLs devem obrigatoriamente terminar em '/': endpoint"
      );
    });
  });
  test("seta corretamente headers e configurações", async () => {
    const baseUrl = `${API_URL}/test/`;
    mock.onGet(baseUrl).reply(200, ["lista", "de", "substitutos"]);
    const response = await axios.get(`test/`);
    expect(response.data).toEqual(["lista", "de", "substitutos"]);
    expect(response.status).toEqual(200);
    expect(response.config.baseURL).toEqual(API_URL);
    expect(response.config.headers).toMatchObject({
      Accept: "application/json, text/plain, */*",
    });
  });
});
