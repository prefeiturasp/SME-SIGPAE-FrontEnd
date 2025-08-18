import { normalizarValores } from "../helpers";

describe("Função helpers.tsx", () => {
  test("normalizarValores verifica a quantidade de dados e NÃO remove campos de filtros pois não foram informados 'todos'", () => {
    const valores = {
      unidades_educacionais_selecionadas: ["1", "2"],
      alergias_intolerancias_selecionadas: ["2", "3"],
      classificacoes_selecionadas: ["3", "4"],
      unidades_length: 1,
      classificacoes_length: 1,
      alergias_intolerancias_length: 1,
    };
    const retorno = normalizarValores(valores);
    expect(retorno).toHaveProperty("unidades_educacionais_selecionadas");
    expect(retorno).not.toHaveProperty("unidades_length");
    expect(retorno).toHaveProperty("alergias_intolerancias_selecionadas");
    expect(retorno).not.toHaveProperty("classificacoes_length");
    expect(retorno).toHaveProperty("classificacoes_selecionadas");
    expect(retorno).not.toHaveProperty("alergias_intolerancias_length");
  });

  test("normalizarValores verifica a quantidade de dados e REMOVE campos de filtros pois foram informados 'todos'", () => {
    const valores = {
      unidades_educacionais_selecionadas: ["1"],
      alergias_intolerancias_selecionadas: ["2"],
      classificacoes_selecionadas: ["3"],
      unidades_length: 1,
      classificacoes_length: 1,
      alergias_intolerancias_length: 1,
    };
    const retorno = normalizarValores(valores);
    expect(retorno).not.toHaveProperty("unidades_educacionais_selecionadas");
    expect(retorno).not.toHaveProperty("unidades_length");
    expect(retorno).not.toHaveProperty("alergias_intolerancias_selecionadas");
    expect(retorno).not.toHaveProperty("classificacoes_length");
    expect(retorno).not.toHaveProperty("classificacoes_selecionadas");
    expect(retorno).not.toHaveProperty("alergias_intolerancias_length");
  });
});
