import mock from "../_mock";
import axios from "../_base";

describe("_mock service", () => {
  it("deve interceptar uma requisição e retornar o mock esperado", async () => {
    mock.onGet("/test/").reply(200, { message: "sucesso" });

    const response = await axios.get("/test/");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: "sucesso" });
  });
});
