import { pontuarValor } from "../../utilities";

describe("Teste pontuarValor", () => {
  it("retorna valor pontuado", () => {
    expect(pontuarValor(123456789)).toEqual("123,456,789");
  });
  it("retorna valor sem pontuar", () => {
    expect(pontuarValor(123)).toEqual("123");
  });
});
