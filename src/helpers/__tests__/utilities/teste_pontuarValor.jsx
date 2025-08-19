import { pontuarValor } from "../../utilities";

describe("Teste pontuarValor", () => {
  it("retorna valor pontuado", () => {
    const resultado = pontuarValor(123456789);
    expect(resultado === "123,456,789" || resultado === "123.456.789").toBe(
      true
    );
  });
  it("retorna valor sem pontuar", () => {
    expect(pontuarValor(123)).toEqual("123");
  });
});
