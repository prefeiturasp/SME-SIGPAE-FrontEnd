import { CORES } from "../../Graficos/constants";

describe("Constantes dos gráficos", () => {
  it("disponibiliza trinta cores com índices sequenciais", () => {
    const indices = Object.keys(CORES).map(Number);

    expect(indices).toEqual(Array.from({ length: 30 }, (_, indice) => indice));
    expect(CORES[0]).toBe("#02A724");
    expect(CORES[29]).toBe("#FFB6C1");
  });

  it("mantém todas as cores no formato hexadecimal", () => {
    Object.values(CORES).forEach((cor) => {
      expect(cor).toMatch(/^#[0-9A-F]{6}$/);
    });
  });
});
