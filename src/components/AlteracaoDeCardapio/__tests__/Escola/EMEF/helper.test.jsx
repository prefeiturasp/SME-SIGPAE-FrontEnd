import { formataValues } from "src/components/AlteracaoDeCardapio/Escola/helper";

describe("helper formataValues - Alteração de Cardápio Escola", () => {
  it("preenche datas_intervalo com intervalo quando há data_inicial e data_final", () => {
    const values = formataValues({
      data_inicial: "30/01/2025",
      data_final: "01/02/2025",
      substituicoes: [],
    });
    expect(values.datas_intervalo).toEqual([
      { data: "2025-01-30" },
      { data: "2025-01-31" },
      { data: "2025-02-01" },
    ]);
  });

  it("preenche datas_intervalo com um único dia quando há alterar_dia", () => {
    const values = formataValues({
      alterar_dia: "30/01/2025",
      substituicoes: [],
    });
    expect(values.datas_intervalo).toEqual([{ data: "2025-01-30" }]);
  });

  it("não preenche datas_intervalo quando não há datas", () => {
    const values = formataValues({ substituicoes: [] });
    expect(values.datas_intervalo).toBeUndefined();
  });
});
