import { gerarLabelPorFiltro } from "../produto";

describe("test gerarLabelPorFiltro", () => {
  test("mais de um filtro", () => {
    expect(
      gerarLabelPorFiltro({
        nome_produto: "ASDF",
        nome_marca: "QweR",
      })
    ).toEqual("Veja os resultados para a busca");
  });
  test("apenas nome_produto 01", () => {
    expect(
      gerarLabelPorFiltro({
        nome_produto: "ASDF",
      })
    ).toEqual('Veja os resultados para "ASDF"');
  });
  test("apenas nome_produto 02", () => {
    expect(
      gerarLabelPorFiltro({
        nome_produto: "ASDF",
        nome_marca: undefined,
      })
    ).toEqual('Veja os resultados para "ASDF"');
  });
});
