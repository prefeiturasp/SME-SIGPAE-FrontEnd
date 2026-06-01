import { formatarLinhasTabelaDietaEnteral } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI/helper.jsx";

describe("formatarLinhasTabelaDietaEnteral", () => {
  const linhasTabelasDietas = [
    { nome: "Dietas Autorizadas", name: "dietas_autorizadas", uuid: null },
    { nome: "Frequência", name: "frequencia", uuid: null },
    {
      nome: "Lanche",
      name: "lanche",
      uuid: "1d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
    },
    {
      nome: "Lanche 4h",
      name: "lanche_4h",
      uuid: "13fefd96-e476-42a0-81fc-75b9853b726c",
    },
    { nome: "Observações", name: "observacoes", uuid: null },
  ];

  it('deve inserir a linha "Refeição" antes da última linha quando o tipo existe', () => {
    const tiposAlimentacao = [
      { uuid: "1d1304c8-77a8-4c96-badb-dd2e8c1b76d5", nome: "Lanche" },
      { uuid: "13fefd96-e476-42a0-81fc-75b9853b726c", nome: "Lanche 4h" },
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
    ];

    const resultado = formatarLinhasTabelaDietaEnteral(
      tiposAlimentacao,
      linhasTabelasDietas,
    );
    expect(resultado).toHaveLength(linhasTabelasDietas.length + 1);
    expect(resultado[resultado.length - 2]).toEqual({
      nome: "Refeição",
      name: "refeicao",
      uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1",
    });
    expect(resultado[resultado.length - 1]).toEqual(linhasTabelasDietas[4]);
  });

  it('não deve modificar o array quando o tipo "Refeição" não existe', () => {
    const tiposAlimentacao = [
      { uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5", nome: "Lanche" },
      { uuid: "83fefd96-e476-42a0-81fc-75b9853b726c", nome: "Lanche 4h" },
    ];

    const resultado = formatarLinhasTabelaDietaEnteral(
      tiposAlimentacao,
      linhasTabelasDietas,
    );
    expect(resultado).toHaveLength(linhasTabelasDietas.length);
    expect(resultado).toEqual(linhasTabelasDietas);
    expect(resultado).not.toBe(linhasTabelasDietas);
  });

  it("deve preservar a imutabilidade do array original", () => {
    const tiposAlimentacao = [
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
    ];
    const original = [...linhasTabelasDietas];

    formatarLinhasTabelaDietaEnteral(tiposAlimentacao, linhasTabelasDietas);
    expect(linhasTabelasDietas).toEqual(original);
    expect(linhasTabelasDietas[0]).toBe(original[0]);
  });

  it("deve lidar com array linhasTabelasDietas vazio", () => {
    const tiposAlimentacao = [
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
    ];
    const resultado = formatarLinhasTabelaDietaEnteral(tiposAlimentacao, []);

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toEqual({
      nome: "Refeição",
      name: "refeicao",
      uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1",
    });
  });

  it("deve manter a ordem original dos outros elementos após a inserção", () => {
    const tiposAlimentacao = [
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
    ];
    const resultado = formatarLinhasTabelaDietaEnteral(
      tiposAlimentacao,
      linhasTabelasDietas,
    );

    expect(resultado[0]).toEqual(linhasTabelasDietas[0]); // Dietas Autorizadas
    expect(resultado[1]).toEqual(linhasTabelasDietas[1]); // Frequência
    expect(resultado[2]).toEqual(linhasTabelasDietas[2]); // Lanche
    expect(resultado[3]).toEqual(linhasTabelasDietas[3]); // Lanche 4h
    expect(resultado[4]).toEqual({
      nome: "Refeição",
      name: "refeicao",
      uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1",
    });
    expect(resultado[5]).toEqual(linhasTabelasDietas[4]); // Observações
  });
  it('deve usar a primeira ocorrência de "Refeição" quando houver duplicados', () => {
    const tiposAlimentacao = [
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
      { uuid: "1e53ec44-6cf6-4000-a2c3-ca31f42468f4", nome: "Refeição" },
    ];

    const resultado = formatarLinhasTabelaDietaEnteral(
      tiposAlimentacao,
      linhasTabelasDietas,
    );

    expect(resultado[resultado.length - 2]).toEqual({
      nome: "Refeição",
      name: "refeicao",
      uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1",
    });
  });

  it("deve lidar com tiposAlimentacao vazio", () => {
    const resultado = formatarLinhasTabelaDietaEnteral([], linhasTabelasDietas);

    expect(resultado).toEqual(linhasTabelasDietas);
    expect(resultado).not.toBe(linhasTabelasDietas);
  });

  it("não deve mutar os objetos internos de linhasTabelasDietas", () => {
    const tiposAlimentacao = [
      { uuid: "4e53ec44-6cf6-4000-a2c3-ca31f42468f1", nome: "Refeição" },
    ];

    const original = JSON.parse(JSON.stringify(linhasTabelasDietas));

    formatarLinhasTabelaDietaEnteral(tiposAlimentacao, linhasTabelasDietas);

    expect(linhasTabelasDietas).toEqual(original);

    linhasTabelasDietas.forEach((item, index) => {
      expect(item).not.toBe(original[index]);
    });
  });
});
