import { normalizarValores } from "../helpers";

describe("Função helpers.tsx", () => {
  test("normalizarValores remove campos específicos com valor 'todas' e 'todos' de dentro do array", () => {
    const valores = {
      unidades_educacionais_selecionadas: ["todas"],
      alergias_intolerancias_selecionadas: ["todas"],
      classificacoes_selecionadas: ["todos"],
    };
    const retorno = normalizarValores(valores);
    expect(retorno).not.toHaveProperty("unidades_educacionais_selecionadas");
    expect(retorno).not.toHaveProperty("alergias_intolerancias_selecionadas");
    expect(retorno).not.toHaveProperty("classificacoes_selecionadas");
  });
});
