import { validacoesFaixasZeradasAlimentacao } from "../validacoes";

describe("Testa o metodo validacoesFaixasZeradasAlimentacao", () => {
  const mockCalendario = [
    { dia: "01", dia_letivo: true },
    { dia: "02", dia_letivo: true },
    { dia: "03", dia_letivo: false },
    { dia: "04", dia_letivo: true },
  ];
  const feriadosNoMes = ["02"];
  const categoria = { id: 1, nome: "ALIMENTAÇÃO" };
  const faixaEtaria = [
    { uuid: "94750736-ca74-44bb-bcc8-7e7c236d5052" },
    { uuid: "2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5" },
  ];

  const allValues = {
    "matriculados__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_01__categoria_1":
      "5",
    "frequencia__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_01__categoria_1":
      "0",

    "matriculados__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_01__categoria_1":
      "3",
    "frequencia__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_01__categoria_1":
      "0",

    observacoes__dia_01__categoria_1: "<p>obs</p>",

    "matriculados__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_02__categoria_1":
      "2",
    "frequencia__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_02__categoria_1":
      "0",

    "matriculados__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_02__categoria_1":
      "0",
    "frequencia__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_02__categoria_1":
      "",

    "matriculados__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_04__categoria_1":
      "4",
    "frequencia__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_04__categoria_1":
      "0",

    "matriculados__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_04__categoria_1":
      "2",
    "frequencia__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_04__categoria_1":
      "5",
  };

  test('deve retornar array vazio se rowName não for "frequencia"', () => {
    const result = validacoesFaixasZeradasAlimentacao(
      "outro",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValues,
      faixaEtaria,
    );
    expect(result).toEqual([]);
  });

  test('deve retornar array vazio se categoria.nome não for "ALIMENTAÇÃO"', () => {
    const outraCategoria = { id: 2, nome: "DIETA" };
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      outraCategoria,
      allValues,
      faixaEtaria,
    );
    expect(result).toEqual([]);
  });

  test("deve considerar apenas dias letivos e não feriados", () => {
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValues,
      faixaEtaria,
    );
    expect(result).toEqual([{ dia: "01", tem_observacao: true }]);
  });

  test("deve marcar tem_observacao como false quando não há observação válida", () => {
    const allValuesSemObs = {
      ...allValues,
      observacoes__dia_01__categoria_1: "",
    };
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValuesSemObs,
      faixaEtaria,
    );
    expect(result).toEqual([{ dia: "01", tem_observacao: false }]);
  });

  test("deve retornar dias onde todas faixas com matriculados > 0 têm frequencia zero", () => {
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValues,
      faixaEtaria,
    );
    expect(result.length).toBe(1);
    expect(result[0].dia).toBe("01");
  });

  test("deve ignorar faixas com matriculados = 0 ou undefined", () => {
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValues,
      faixaEtaria,
    );
    expect(result.some((r) => r.dia === "02")).toBe(false);
  });

  test("deve retornar vários dias quando houver", () => {
    const allValuesMulti = {
      ...allValues,
      "frequencia__faixa_94750736-ca74-44bb-bcc8-7e7c236d5052__dia_04__categoria_1":
        "0",
      "frequencia__faixa_2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5__dia_04__categoria_1":
        "0",
      observacoes__dia_04__categoria_1: "obs",
    };
    const result = validacoesFaixasZeradasAlimentacao(
      "frequencia",
      mockCalendario,
      feriadosNoMes,
      categoria,
      allValuesMulti,
      faixaEtaria,
    );
    expect(result).toEqual([
      { dia: "01", tem_observacao: true },
      { dia: "04", tem_observacao: true },
    ]);
  });
});
