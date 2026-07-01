import {
  formataPayload,
  formataPayloadUpdate,
  validarFormulariosParaCategoriasDeNotificacao,
  validarFormulariosTiposOcorrencia,
} from "../helpers";

const mockDeepCopy = jest.fn((value: any) => JSON.parse(JSON.stringify(value)));

jest.mock("src/helpers/utilities", () => ({
  deepCopy: (value: any) => mockDeepCopy(value),
}));

const ESCOLA_UUID = "11111111-1111-4111-8111-111111111111";
const TIPO_OCORRENCIA_NAO_UUID = "22222222-2222-4222-8222-222222222222";
const TIPO_OCORRENCIA_NAO_SE_APLICA_UUID =
  "33333333-3333-4333-8333-333333333333";
const TIPO_OCORRENCIA_SIM_UUID = "44444444-4444-4444-8444-444444444444";
const PARAMETRIZACAO_1_UUID = "55555555-5555-4555-8555-555555555555";
const PARAMETRIZACAO_2_UUID = "66666666-6666-4666-8666-666666666666";
const RESPOSTA_UUID = "77777777-7777-4777-8777-777777777777";
const ANEXO_UUID = "88888888-8888-4888-8888-888888888888";
const NOTIFICACAO_UUID = "99999999-9999-4999-8999-999999999999";

const chaveGrupo = `grupos_${TIPO_OCORRENCIA_NAO_UUID}`;

const chaveRespostaSemUuid = `resposta_grupo_campo_${PARAMETRIZACAO_1_UUID}_valor`;

const chaveRespostaComUuid = `resposta_grupo_campo_${PARAMETRIZACAO_2_UUID}_valor_${RESPOSTA_UUID}`;

const escolaSelecionada = {
  uuid: ESCOLA_UUID,
  label: "Escola de Teste",
  value: ESCOLA_UUID,
  lote_nome: "Lote de Teste",
  terceirizada: "Empresa de Teste",
  edital: "edital-teste",
} as any;

const anexos = [
  {
    uuid: ANEXO_UUID,
    nome: "anexo.pdf",
  },
] as any;

const notificacoesAssinadas = [
  {
    uuid: NOTIFICACAO_UUID,
    nome: "notificacao.pdf",
  },
] as any;

const criarValues = (sobrescritas: Record<string, any> = {}) =>
  ({
    acompanhou_visita: "sim",

    [`ocorrencia_${TIPO_OCORRENCIA_NAO_UUID}`]: "nao",

    [`ocorrencia_${TIPO_OCORRENCIA_NAO_SE_APLICA_UUID}`]: "nao_se_aplica",

    [`descricao_${TIPO_OCORRENCIA_NAO_SE_APLICA_UUID}`]:
      "A ocorrência não se aplica à unidade.",

    [`ocorrencia_${TIPO_OCORRENCIA_SIM_UUID}`]: "sim",

    [chaveGrupo]: [
      {
        [chaveRespostaSemUuid]: "Primeira resposta",
        [chaveRespostaComUuid]: "Segunda resposta",
      },
    ],

    ...sobrescritas,
  }) as any;

const criarTipoOcorrencia = ({
  uuid = TIPO_OCORRENCIA_NAO_UUID,
  categoria = "OUTRA CATEGORIA",
  parametrizacoes = [PARAMETRIZACAO_1_UUID, PARAMETRIZACAO_2_UUID],
}: {
  uuid?: string;
  categoria?: string;
  parametrizacoes?: string[];
} = {}) =>
  ({
    uuid,
    categoria: {
      nome: categoria,
    },
    parametrizacoes: parametrizacoes.map((parametrizacaoUuid) => ({
      uuid: parametrizacaoUuid,
    })),
  }) as any;

describe("helpers de NovoRelatorioVisitas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formata os dados para criação do relatório", () => {
    const values = criarValues();

    const valuesOriginais = JSON.parse(JSON.stringify(values));

    const resultado = formataPayload(
      values,
      escolaSelecionada,
      anexos,
      notificacoesAssinadas,
    );

    expect(resultado.escola).toBe(ESCOLA_UUID);

    expect(resultado.acompanhou_visita).toBe(true);

    expect(resultado.ocorrencias_nao_se_aplica).toEqual([
      {
        tipo_ocorrencia: TIPO_OCORRENCIA_NAO_SE_APLICA_UUID,
        descricao: "A ocorrência não se aplica à unidade.",
        uuid: null,
      },
    ]);

    expect(resultado.ocorrencias).toEqual([
      {
        tipoOcorrencia: TIPO_OCORRENCIA_NAO_UUID,
        parametrizacao: PARAMETRIZACAO_1_UUID,
        resposta: "Primeira resposta",
        grupo: 1,
      },
      {
        uuid: RESPOSTA_UUID,
        tipoOcorrencia: TIPO_OCORRENCIA_NAO_UUID,
        parametrizacao: PARAMETRIZACAO_2_UUID,
        resposta: "Segunda resposta",
        grupo: 1,
      },
    ]);

    expect(resultado.anexos).toEqual(anexos);

    expect(resultado.notificacoes_assinadas).toEqual(notificacoesAssinadas);

    expect(values).toEqual(valuesOriginais);

    expect(mockDeepCopy).toHaveBeenCalledWith(values);
  });

  it("formata os dados de atualização e mantém o UUID da resposta existente", () => {
    const values = criarValues({
      acompanhou_visita: "nao",
    });

    const respostasNaoSeAplica = [
      {
        uuid: RESPOSTA_UUID,
        tipo_ocorrencia: TIPO_OCORRENCIA_NAO_SE_APLICA_UUID,
      },
    ];

    const resultado = formataPayloadUpdate(
      values,
      escolaSelecionada,
      anexos,
      notificacoesAssinadas,
      respostasNaoSeAplica,
    );

    expect(resultado.escola).toBe(ESCOLA_UUID);

    expect(resultado.acompanhou_visita).toBe(false);

    expect(resultado.ocorrencias_nao_se_aplica).toEqual([
      {
        tipo_ocorrencia: TIPO_OCORRENCIA_NAO_SE_APLICA_UUID,
        descricao: "A ocorrência não se aplica à unidade.",
        uuid: RESPOSTA_UUID,
      },
    ]);

    expect(resultado.ocorrencias_sim).toEqual([TIPO_OCORRENCIA_SIM_UUID]);

    expect(resultado.ocorrencias).toHaveLength(2);

    expect(resultado.anexos).toEqual(anexos);

    expect(resultado.notificacoes_assinadas).toEqual(notificacoesAssinadas);
  });

  it("considera válido quando todas as parametrizações possuem resposta", () => {
    const values = criarValues();

    const tiposOcorrencia = [criarTipoOcorrencia()];

    const resultado = validarFormulariosTiposOcorrencia(
      values,
      tiposOcorrencia,
    );

    expect(resultado.listaValidacaoPorTipoOcorrencia).toEqual([
      {
        tipo_ocorrencia: TIPO_OCORRENCIA_NAO_UUID,
        valid: true,
      },
    ]);

    expect(resultado.formulariosValidos).toBe(true);
  });

  it("valida somente os tipos pertencentes às categorias de notificação", () => {
    const tipoQuantidadeUuid = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

    const tipoManutencaoUuid = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

    const tipoIgnoradoUuid = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

    const parametroQuantidadeUuid = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

    const parametroManutencaoUuid = "ffffffff-ffff-4fff-8fff-ffffffffffff";

    const parametroIgnoradoUuid = "12121212-1212-4212-8212-121212121212";

    const respostaQuantidade = `resposta_grupo_campo_${parametroQuantidadeUuid}_valor`;

    const respostaManutencao = `resposta_grupo_campo_${parametroManutencaoUuid}_valor`;

    const respostaIgnorada = `resposta_grupo_campo_${parametroIgnoradoUuid}_valor`;

    const values = {
      [`ocorrencia_${tipoQuantidadeUuid}`]: "nao",

      [`grupos_${tipoQuantidadeUuid}`]: [
        {
          [respostaQuantidade]: "Resposta preenchida",
        },
      ],

      [`ocorrencia_${tipoManutencaoUuid}`]: "nao",

      [`grupos_${tipoManutencaoUuid}`]: [
        {
          [respostaManutencao]: "",
        },
      ],

      [`ocorrencia_${tipoIgnoradoUuid}`]: "nao",

      [`grupos_${tipoIgnoradoUuid}`]: [
        {
          [respostaIgnorada]: "",
        },
      ],
    } as any;

    const tiposOcorrencia = [
      criarTipoOcorrencia({
        uuid: tipoQuantidadeUuid,
        categoria:
          "QUANTIDADE/QUALIDADE DE UTENSÍLIOS/MOBILIÁRIOS/EQUIPAMENTOS",
        parametrizacoes: [parametroQuantidadeUuid],
      }),

      criarTipoOcorrencia({
        uuid: tipoManutencaoUuid,
        categoria: "MANUTENÇÃO DE EQUIPAMENTOS/REPARO E ADAPTAÇÃO",
        parametrizacoes: [parametroManutencaoUuid],
      }),

      criarTipoOcorrencia({
        uuid: tipoIgnoradoUuid,
        categoria: "OUTRA CATEGORIA",
        parametrizacoes: [parametroIgnoradoUuid],
      }),
    ];

    const resultado = validarFormulariosParaCategoriasDeNotificacao(
      values,
      tiposOcorrencia,
    );

    expect(resultado.listaValidacaoPorTipoOcorrencia).toEqual([
      {
        tipo_ocorrencia: tipoQuantidadeUuid,
        valid: true,
      },
      {
        tipo_ocorrencia: tipoManutencaoUuid,
        valid: false,
      },
    ]);

    expect(resultado.formulariosValidos).toBe(false);

    expect(resultado.listaValidacaoPorTipoOcorrencia).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tipo_ocorrencia: tipoIgnoradoUuid,
        }),
      ]),
    );
  });
});
