import { httpTohttps } from "../helpers";

describe("Teste httpTohttps", () => {
  test("se URL começa com http://, retorna a url começando em https", () => {
    expect(httpTohttps("http://www.example.com")).toEqual(
      "https://www.example.com"
    );
  });
  test("se URL não começa com http://, retorna a mesma url", () => {
    expect(httpTohttps("https://example.com")).toEqual("https://example.com");
  });
});
