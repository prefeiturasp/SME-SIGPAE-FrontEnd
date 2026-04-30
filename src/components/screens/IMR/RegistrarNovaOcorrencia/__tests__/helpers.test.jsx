import { formataPayload } from "../helpers";

describe("Helpers formataPayload - Registrar Nova Corrência", () => {
  it("deve formatar o payload corretamente com ocorrências e solicitacao_medicao_inicial", () => {
    const values = {
      categoria: "categoria_teste",
      tipo_ocorrencia: "tipo_teste",
      datas: ["2026-04-29"],
      ocorrencias: [],
      grupos: [
        {
          campo_tipo_uuidTipo1_param_uuidParam1: "Resposta 1",
          campo_tipo_uuidTipo1_param_uuidParam2: true,
        },
        {
          campo_tipo_uuidTipo2_param_uuidParam3: 10,
        },
      ],
    };

    const result = formataPayload(values, "uuid-solicitacao-medicao-inicial");

    expect(result.solicitacao_medicao_inicial).toBe(
      "uuid-solicitacao-medicao-inicial",
    );

    expect(result.ocorrencias).toEqual([
      {
        tipoOcorrencia: "uuidTipo1",
        parametrizacao: "uuidParam1",
        resposta: "Resposta 1",
        grupo: 1,
      },
      {
        tipoOcorrencia: "uuidTipo1",
        parametrizacao: "uuidParam2",
        resposta: true,
        grupo: 1,
      },
      {
        tipoOcorrencia: "uuidTipo2",
        parametrizacao: "uuidParam3",
        resposta: 10,
        grupo: 2,
      },
    ]);
  });

  it("deve sobrescrever resposta duplicada quando a resposta anterior for string", () => {
    const values = {
      categoria: "categoria_teste",
      tipo_ocorrencia: "tipo_teste",
      datas: ["2026-04-29"],
      ocorrencias: [],
      grupos: [
        {
          campo_tipo_uuidTipo1_param_uuidParam1: "Resposta inicial",
          outro_tipo_uuidTipo1_param_uuidParam1: false,
        },
      ],
    };

    const result = formataPayload(values, "uuid-solicitacao-medicao-inicial");

    expect(result.ocorrencias).toEqual([
      {
        tipoOcorrencia: "uuidTipo1",
        parametrizacao: "uuidParam1",
        resposta: false,
        grupo: 1,
      },
    ]);
  });

  it("não deve sobrescrever resposta duplicada quando a resposta anterior não for string", () => {
    const values = {
      categoria: "categoria_teste",
      tipo_ocorrencia: "tipo_teste",
      datas: ["2026-04-29"],
      ocorrencias: [],
      grupos: [
        {
          campo_tipo_uuidTipo1_param_uuidParam1: true,
          outro_tipo_uuidTipo1_param_uuidParam1: "Nova resposta",
        },
      ],
    };

    const result = formataPayload(values, "uuid-solicitacao-medicao-inicial");

    expect(result.ocorrencias).toEqual([
      {
        tipoOcorrencia: "uuidTipo1",
        parametrizacao: "uuidParam1",
        resposta: true,
        grupo: 1,
      },
    ]);
  });

  it("não deve mutar o objeto original", () => {
    const values = {
      categoria: "categoria_teste",
      tipo_ocorrencia: "tipo_teste",
      datas: ["2026-04-29"],
      ocorrencias: [],
      grupos: [
        {
          campo_tipo_uuidTipo1_param_uuidParam1: "Resposta original",
        },
      ],
    };

    const valuesOriginal = JSON.parse(JSON.stringify(values));

    formataPayload(values, "novo-uuid");

    expect(values).toEqual(valuesOriginal);
    expect(values.solicitacao_medicao_inicial).toBeUndefined();
  });
});
