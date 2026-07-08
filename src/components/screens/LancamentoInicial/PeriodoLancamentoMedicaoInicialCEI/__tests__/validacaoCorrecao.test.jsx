import { ehDiaParaCorrigir } from "../helper";

const CORRECTION_STATUSES = [
  "MEDICAO_CORRECAO_SOLICITADA",
  "MEDICAO_CORRECAO_SOLICITADA_CODAE",
  "MEDICAO_CORRIGIDA_PELA_UE",
  "MEDICAO_CORRIGIDA_PARA_CODAE",
];

const READ_ONLY_ROWS = [
  "matriculados",
  "numero_de_alunos",
  "dietas_autorizadas",
  "participantes",
];

const validaCorrecaoCampoVazioCEI = ({
  statusPeriodo,
  rowName,
  dia,
  idCategoria,
  value,
  diasParaCorrecao,
  uuidFaixaEtaria = null,
  allValues = {},
  usaFaixa = true,
  ehRecreio = false,
}) => {
  const isInCorrectionMode =
    statusPeriodo && CORRECTION_STATUSES.includes(statusPeriodo);
  if (!isInCorrectionMode) return undefined;

  const isCorrectionDay = ehDiaParaCorrigir(dia, idCategoria, diasParaCorrecao);
  if (!isCorrectionDay) return undefined;

  if (READ_ONLY_ROWS.includes(rowName)) return undefined;

  if (usaFaixa && uuidFaixaEtaria) {
    const prefixo = ehRecreio ? "participantes" : "matriculados";
    const chave = `${prefixo}__faixa_${uuidFaixaEtaria}__dia_${dia}__categoria_${idCategoria}`;
    const temAlunos = allValues[chave] && Number(allValues[chave]) > 0;
    if (!temAlunos) return undefined;
  }

  if (value === "" || value === null || value === undefined) {
    return "Preenchimento obrigatório.";
  }

  return undefined;
};

const validaCorrecaoCampoVazioEmeiCemei = ({
  statusPeriodo,
  rowName,
  dia,
  idCategoria,
  value,
  diasParaCorrecao,
  allValues = {},
  ehRecreio = false,
}) => {
  const isInCorrectionMode =
    statusPeriodo && CORRECTION_STATUSES.includes(statusPeriodo);
  if (!isInCorrectionMode) return undefined;

  const isCorrectionDay = ehDiaParaCorrigir(dia, idCategoria, diasParaCorrecao);
  if (!isCorrectionDay) return undefined;

  if (READ_ONLY_ROWS.includes(rowName)) return undefined;

  const prefixo = ehRecreio ? "participantes" : "matriculados";
  const chaveMatriculados = `${prefixo}__dia_${dia}__categoria_${idCategoria}`;
  const temAlunos =
    allValues[chaveMatriculados] && Number(allValues[chaveMatriculados]) > 0;
  if (!temAlunos) return undefined;

  if (value === "" || value === null || value === undefined) {
    return "Preenchimento obrigatório.";
  }

  return undefined;
};

describe("validaCorrecaoCampoVazio - CEI (com faixa etária)", () => {
  const defaultDiasParaCorrecao = [
    { dia: "01", categoria_medicao: 1, habilitado_correcao: true },
    { dia: "15", categoria_medicao: 2, habilitado_correcao: true },
  ];

  const faixaUuid = "94750736-ca74-44bb-bcc8-7e7c236d5052";
  const otraFaixaUuid = "2fc92a3d-bed7-490b-8ae9-405f9e3f2ca5";

  const allValuesComAlunos = {
    [`matriculados__faixa_${faixaUuid}__dia_01__categoria_1`]: "20",
    [`matriculados__faixa_${otraFaixaUuid}__dia_01__categoria_1`]: "0",
  };

  const allValuesRecreio = {
    [`participantes__faixa_${faixaUuid}__dia_01__categoria_1`]: "15",
  };

  describe("faixa etária com alunos > 0", () => {
    it('retorna "Preenchimento obrigatório." quando campo vazio e faixa tem alunos', () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: allValuesComAlunos,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it("NÃO retorna erro quando campo está preenchido e faixa tem alunos", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "5",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: allValuesComAlunos,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando campo é '0' e faixa tem alunos", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "0",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: allValuesComAlunos,
      });
      expect(result).toBeUndefined();
    });
  });

  describe("faixa etária sem alunos (matriculados = 0)", () => {
    it("NÃO retorna erro quando faixa tem matriculados = 0", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: otraFaixaUuid,
        allValues: allValuesComAlunos,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando faixa não está no allValues", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: "faixa-inexistente",
        allValues: allValuesComAlunos,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando allValues está vazio", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: {},
      });
      expect(result).toBeUndefined();
    });
  });

  describe("recreio nas férias (usa 'participantes')", () => {
    it("retorna erro quando campo vazio e faixa tem participantes > 0 no recreio", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: allValuesRecreio,
        ehRecreio: true,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });
  });

  describe("sem faixa (usaFaixa = false, caso EMEI/CEMEI)", () => {
    it("retorna erro quando campo vazio mesmo sem uuidFaixaEtaria", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        usaFaixa: false,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });
  });

  describe("linhas somente-leitura", () => {
    it.each(READ_ONLY_ROWS)(
      "NÃO retorna erro para linha %s (somente-leitura)",
      (rowName) => {
        const result = validaCorrecaoCampoVazioCEI({
          statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
          rowName,
          dia: "01",
          idCategoria: 1,
          value: "",
          diasParaCorrecao: defaultDiasParaCorrecao,
          uuidFaixaEtaria: faixaUuid,
          allValues: allValuesComAlunos,
        });
        expect(result).toBeUndefined();
      },
    );
  });

  describe("fora do modo correção", () => {
    it("NÃO retorna erro quando status não é de correção", () => {
      const result = validaCorrecaoCampoVazioCEI({
        statusPeriodo: "MEDICAO_APROVADA_PELA_DRE",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
        uuidFaixaEtaria: faixaUuid,
        allValues: allValuesComAlunos,
      });
      expect(result).toBeUndefined();
    });
  });

  describe("múltiplos status de correção", () => {
    it.each(CORRECTION_STATUSES)(
      "retorna erro no status de correção %s",
      (status) => {
        const result = validaCorrecaoCampoVazioCEI({
          statusPeriodo: status,
          rowName: "frequencia",
          dia: "01",
          idCategoria: 1,
          value: "",
          diasParaCorrecao: defaultDiasParaCorrecao,
          uuidFaixaEtaria: faixaUuid,
          allValues: allValuesComAlunos,
        });
        expect(result).toBe("Preenchimento obrigatório.");
      },
    );
  });
});

describe("validaCorrecaoCampoVazio - EMEI da CEMEI (sem faixa)", () => {
  const defaultDiasParaCorrecao = [
    { dia: "01", categoria_medicao: 1, habilitado_correcao: true },
  ];

  const allValuesComAlunos = {
    matriculados__dia_01__categoria_1: "20",
    matriculados__dia_02__categoria_1: "0",
  };

  const allValuesRecreio = {
    participantes__dia_01__categoria_1: "15",
  };

  it('retorna "Preenchimento obrigatório." quando campo vazio em dia de correção com alunos > 0', () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "01",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: defaultDiasParaCorrecao,
      allValues: allValuesComAlunos,
    });
    expect(result).toBe("Preenchimento obrigatório.");
  });

  it("NÃO retorna erro quando campo vazio em dia com log zerado (matriculados = 0)", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "02",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: [
        { dia: "02", categoria_medicao: 1, habilitado_correcao: true },
      ],
      allValues: allValuesComAlunos,
    });
    expect(result).toBeUndefined();
  });

  it("NÃO retorna erro quando não há matriculados para o dia no allValues", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "99",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: [
        { dia: "99", categoria_medicao: 1, habilitado_correcao: true },
      ],
      allValues: allValuesComAlunos,
    });
    expect(result).toBeUndefined();
  });

  it("NÃO retorna erro quando campo está preenchido", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "01",
      idCategoria: 1,
      value: "10",
      diasParaCorrecao: defaultDiasParaCorrecao,
      allValues: allValuesComAlunos,
    });
    expect(result).toBeUndefined();
  });

  it("NÃO retorna erro quando campo é '0'", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "01",
      idCategoria: 1,
      value: "0",
      diasParaCorrecao: defaultDiasParaCorrecao,
      allValues: allValuesComAlunos,
    });
    expect(result).toBeUndefined();
  });

  it("retorna erro no recreio com participantes > 0", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "01",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: defaultDiasParaCorrecao,
      allValues: allValuesRecreio,
      ehRecreio: true,
    });
    expect(result).toBe("Preenchimento obrigatório.");
  });

  it("NÃO retorna erro fora do modo correção", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_APROVADA_PELA_DRE",
      rowName: "frequencia",
      dia: "01",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: defaultDiasParaCorrecao,
    });
    expect(result).toBeUndefined();
  });

  it("NÃO retorna erro para linhas somente-leitura", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "matriculados",
      dia: "01",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: defaultDiasParaCorrecao,
      allValues: allValuesComAlunos,
    });
    expect(result).toBeUndefined();
  });

  it("NÃO retorna erro quando dia/categoria não é dia de correção", () => {
    const result = validaCorrecaoCampoVazioEmeiCemei({
      statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
      rowName: "frequencia",
      dia: "99",
      idCategoria: 1,
      value: "",
      diasParaCorrecao: defaultDiasParaCorrecao,
    });
    expect(result).toBeUndefined();
  });
});
