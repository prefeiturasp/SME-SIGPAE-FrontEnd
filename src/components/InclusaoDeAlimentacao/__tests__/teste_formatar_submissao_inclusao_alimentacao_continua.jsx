import { formatarSubmissaoSolicitacaoContinua } from "../helper";

describe("Teste formatarSubmissão Inclusão de Alimentação Contínua", () => {
  const solicitacaoInclusaoAlimentacaoContinua = {
    inclusoes: [
      {
        motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
        data_inicial: "01/08/2019",
        data_final: "31/08/2019",
        dias_semana: [1, 2, 3],
        outro_motivo: null,
      },
    ],
    quantidades_periodo: [
      {
        checked: true,
        numero_alunos: "123",
        uuid: "73605a3b-7767-4ea6-845e-fef62f84dc1c",
        tipos_alimentacao_selecionados: [
          "4c4b4d8e-6c32-456a-b1e5-524da9278629",
        ],
      },
    ],
    descricao: "<p>Descrição</p>",
  };

  const meusDados = {
    vinculo_atual: {
      instituicao: {
        uuid: "9f86ecb8-bdba-4d70-9fb7-13844f563636",
      },
    },
  };

  it("formata submissao inclusao de alimentacao continua", () => {
    const resposta = {
      data_inicial: "01/08/2019",
      data_final: "31/08/2019",
      descricao: "<p>Descrição</p>",
      motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
      inclusoes: [
        {
          motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
          data_inicial: "01/08/2019",
          data_final: "31/08/2019",
          dias_semana: [1, 2, 3],
          outro_motivo: null,
        },
      ],
      quantidades_periodo: [
        {
          checked: true,
          numero_alunos: "123",
          uuid: "73605a3b-7767-4ea6-845e-fef62f84dc1c",
          tipos_alimentacao_selecionados: [
            "4c4b4d8e-6c32-456a-b1e5-524da9278629",
          ],
        },
      ],
    };
    expect(
      formatarSubmissaoSolicitacaoContinua(
        solicitacaoInclusaoAlimentacaoContinua,
        meusDados
      )
    ).toEqual(resposta);
  });
});
