import { calcularNumeroDeEscolasUnicas } from "../../components/CardPendenteAcao/helper";

describe("Teste de helper.jsx - calcularNumeroDeEscolasUnicas", () => {
  it("deve retornar 0 quando não houver pedidos", () => {
    expect(calcularNumeroDeEscolasUnicas([])).toBe(0);
  });

  it("deve contar escolas únicas corretamente", () => {
    const pedidos = [
      {
        escola: { uuid: "escola-1" },
      },
      {
        escola: { uuid: "escola-2" },
      },
      {
        escola: { uuid: "escola-1" },
      },
    ];

    expect(calcularNumeroDeEscolasUnicas(pedidos)).toBe(2);
  });

  it("deve retornar 1 quando todos pedidos forem da mesma escola", () => {
    const pedidos = [
      { escola: { uuid: "escola-1" } },
      { escola: { uuid: "escola-1" } },
    ];

    expect(calcularNumeroDeEscolasUnicas(pedidos)).toBe(1);
  });
});
