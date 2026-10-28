import {
  agruparRefeicaoESobremesa,
  backgroundLabelPeriodo,
  formatarPayload,
  normalizarTiposAlimentacao,
  validaQuantidadeFaixaCEI,
} from "src/components/AlteracaoDeCardapioCEMEI/helpers";
import { REFEICAO_E_SOBREMESA } from "src/components/AlteracaoDeCardapio/Escola/helper";

describe("helpers - backgroundLabelPeriodo", () => {
  it("aplica cor de fundo e borda por período", () => {
    const periodos = [
      { nome: "MANHA" },
      { nome: "TARDE" },
      { nome: "NOITE" },
      { nome: "INTEGRAL" },
      { nome: "OUTRO" },
    ];

    const resultado = backgroundLabelPeriodo(periodos);

    expect(resultado[0]).toMatchObject({
      background: "#fff7cb",
      borderColor: "#ffd79b",
    });
    expect(resultado[1]).toMatchObject({
      background: "#ffeed6",
      borderColor: "#ffbb8a",
    });
    expect(resultado[2]).toMatchObject({
      background: "#e4f1ff",
      borderColor: "#82b7e8",
    });
    expect(resultado[3]).toMatchObject({
      background: "#ebedff",
      borderColor: "#b2baff",
    });
    expect(resultado[4]).toMatchObject({
      background: "#eaffe3",
      borderColor: "#79cf91",
    });
  });
});

describe("helpers - validaQuantidadeFaixaCEI", () => {
  const validar = validaQuantidadeFaixaCEI({
    periodoIndice: 0,
    max: 10,
  });

  it("retorna erro quando o valor é menor que 1", () => {
    const allValues = {
      substituicoes: [
        {
          cei: {
            faixas_etarias: [
              { quantidade_alunos: 1 },
              { quantidade_alunos: 2 },
            ],
          },
        },
      ],
    };
    expect(validar("0", allValues)).toBe("Deve ser ao menos 1");
  });

  it("retorna erro quando o valor é maior que o máximo", () => {
    const allValues = {
      substituicoes: [
        {
          cei: {
            faixas_etarias: [
              { quantidade_alunos: 1 },
              { quantidade_alunos: 2 },
            ],
          },
        },
      ],
    };
    expect(validar("11", allValues)).toBe("Não pode ser maior que 10");
  });
});

describe("helpers - formatarPayload", () => {
  it("monta payload ignorando substituições nulas e sem emei", () => {
    const meusDados = {
      vinculo_atual: { instituicao: { uuid: "escola-uuid" } },
    };
    const values = {
      motivo: "motivo-uuid",
      alunos_cei_e_ou_emei: "TODOS",
      alterar_dia: "20/08/2025",
      data_inicial: undefined,
      data_final: undefined,
      observacao: "obs",
      substituicoes: [
        null,
        {
          checked: true,
          cei: {
            tipos_alimentacao_de: "ta",
            tipos_alimentacao_para: "tp",
            faixas_etarias: [
              {
                faixa_uuid: "f1",
                quantidade_alunos: 2,
                matriculados_quando_criado: 1,
              },
              null,
            ],
          },
        },
        {
          checked: true,
          cei: {
            tipos_alimentacao_de: ["ta"],
            tipos_alimentacao_para: ["tp"],
            faixas_etarias: [],
          },
          periodo_uuid: "p2",
        },
      ],
    };

    const payload = formatarPayload(values, meusDados);

    expect(payload.escola).toBe("escola-uuid");
    expect(payload.substituicoes_cemei_cei_periodo_escolar).toHaveLength(2);
    expect(
      payload.substituicoes_cemei_cei_periodo_escolar[0].tipos_alimentacao_de,
    ).toEqual(["ta"]);
    expect(payload.substituicoes_cemei_emei_periodo_escolar).toHaveLength(0);
  });

  it("normaliza os tipos do CEI e EMEI como arrays", () => {
    const meusDados = {
      vinculo_atual: { instituicao: { uuid: "escola-uuid" } },
    };
    const vinculos = [
      {
        tipo_unidade_escolar: { iniciais: "EMEI" },
        periodo_escolar: { uuid: "p1" },
        tipos_alimentacao: [
          { nome: "Refeição", uuid: "uuid-refeicao" },
          { nome: "Sobremesa", uuid: "uuid-sobremesa" },
        ],
      },
    ];
    const values = {
      motivo: "motivo-uuid",
      alunos_cei_e_ou_emei: "EMEI",
      substituicoes: [
        {
          checked: true,
          periodo_uuid: "p1",
          emei: {
            tipos_alimentacao_de: "uuid-refeicao",
            tipos_alimentacao_para: REFEICAO_E_SOBREMESA,
            quantidade_alunos: 1,
          },
        },
      ],
    };

    const payload = formatarPayload(values, meusDados, vinculos);

    expect(
      payload.substituicoes_cemei_emei_periodo_escolar[0].tipos_alimentacao_de,
    ).toEqual(["uuid-refeicao"]);
    expect(
      payload.substituicoes_cemei_emei_periodo_escolar[0]
        .tipos_alimentacao_para,
    ).toEqual(["uuid-refeicao", "uuid-sobremesa"]);
  });
});

describe("helpers - agruparRefeicaoESobremesa", () => {
  it("substitui Sobremesa por Refeição e Sobremesa quando há ambos", () => {
    const opcoes = agruparRefeicaoESobremesa([
      { nome: "Refeição", uuid: "uuid-refeicao" },
      { nome: "Sobremesa", uuid: "uuid-sobremesa" },
    ]);
    expect(opcoes.map((opcao) => opcao.nome)).toEqual([
      "Refeição",
      "Refeição e Sobremesa",
    ]);
  });

  it("não altera a lista quando falta Refeição ou Sobremesa", () => {
    const opcoes = agruparRefeicaoESobremesa([
      { nome: "Lanche", uuid: "uuid-lanche" },
    ]);
    expect(opcoes).toHaveLength(1);
  });
});

describe("helpers - normalizarTiposAlimentacao", () => {
  const vinculos = [
    {
      tipo_unidade_escolar: { iniciais: "EMEI" },
      periodo_escolar: { uuid: "p1" },
      tipos_alimentacao: [
        { nome: "Refeição", uuid: "uuid-refeicao" },
        { nome: "Sobremesa", uuid: "uuid-sobremesa" },
      ],
    },
  ];

  it("retorna undefined quando não há seleção", () => {
    expect(normalizarTiposAlimentacao(undefined, vinculos, "EMEI", "p1")).toBe(
      undefined,
    );
  });

  it("envolve um uuid simples em array", () => {
    expect(
      normalizarTiposAlimentacao("uuid-lanche", vinculos, "EMEI", "p1"),
    ).toEqual(["uuid-lanche"]);
  });

  it("expande Refeição e Sobremesa para os uuids correspondentes", () => {
    expect(
      normalizarTiposAlimentacao(REFEICAO_E_SOBREMESA, vinculos, "EMEI", "p1"),
    ).toEqual(["uuid-refeicao", "uuid-sobremesa"]);
  });

  it("mantém arrays existentes", () => {
    expect(
      normalizarTiposAlimentacao(["a", "b"], vinculos, "EMEI", "p1"),
    ).toEqual(["a", "b"]);
  });
});
