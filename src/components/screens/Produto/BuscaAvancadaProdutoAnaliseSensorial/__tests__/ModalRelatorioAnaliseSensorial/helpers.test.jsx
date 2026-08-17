import { getTituloRelatorio } from "../../components/ModalRelatorioAnaliseSensorial/helpers";

describe("Teste de helper Relatório Análise Sensorial - getTituloRelatorio", () => {
  it("deve retornar mensagem padrão quando não houver filtros", () => {
    expect(getTituloRelatorio({})).toBe("Veja os resultados para a busca:");
  });

  it("deve retornar mensagem padrão quando houver mais de dois filtros", () => {
    expect(
      getTituloRelatorio({
        nome_produto: "Arroz",
        nome_marca: "Marca A",
        nome_fabricante: "Fabricante A",
      }),
    ).toBe("Veja os resultados para a busca:");
  });

  it("deve retornar o título para filtro de nome do produto", () => {
    expect(
      getTituloRelatorio({
        nome_produto: "Arroz Integral",
      }),
    ).toBe('Veja os resultados para "Arroz Integral"');
  });

  it("deve retornar o título para filtro de terceirizada", () => {
    expect(
      getTituloRelatorio({
        nome_terceirizada: "Empresa ABC",
      }),
    ).toBe('Veja os resultados para "Empresa ABC"');
  });

  it("deve retornar o título para filtro de marca", () => {
    expect(
      getTituloRelatorio({
        nome_marca: "Marca Boa",
      }),
    ).toBe('Veja os resultados para "Marca Boa"');
  });

  it("deve retornar o título para filtro de fabricante", () => {
    expect(
      getTituloRelatorio({
        nome_fabricante: "Fabricante X",
      }),
    ).toBe('Veja os resultados para "Fabricante X"');
  });

  it("deve retornar o título para data inicial", () => {
    expect(
      getTituloRelatorio({
        data_analise_inicial: "01/08/2026",
      }),
    ).toBe('Veja os resultados a partir de "01/08/2026":');
  });

  it("deve retornar o título para data final", () => {
    expect(
      getTituloRelatorio({
        data_analise_final: "31/08/2026",
      }),
    ).toBe('Veja os resultados até "31/08/2026"');
  });

  it("deve retornar o título para período entre data inicial e final", () => {
    expect(
      getTituloRelatorio({
        data_analise_inicial: "01/08/2026",
        data_analise_final: "31/08/2026",
      }),
    ).toBe("Veja os resultados para o período de 01/08/2026 à 31/08/2026:");
  });

  it("deve retornar mensagem padrão quando houver dois filtros sem período completo", () => {
    expect(
      getTituloRelatorio({
        nome_produto: "Arroz",
        nome_marca: "Marca Boa",
      }),
    ).toBe("Veja os resultados para a busca:");
  });
});
