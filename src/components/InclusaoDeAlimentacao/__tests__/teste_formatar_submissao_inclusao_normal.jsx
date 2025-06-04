import { formatarSubmissaoSolicitacaoNormal } from "../helper";

describe("Teste formatarSubmissão Inclusão de Alimentação Normal", () => {
  beforeEach(() => {
    localStorage.setItem(
      "nome_instituicao",
      "EMEF PERICLES EUGENIO DA SILVA RAMOS"
    );
  });

  const solicitacaoInclusaoAlimentacaoNormal = {
    inclusoes: [
      {
        motivo: "6d39bbbb-574a-47b2-9c04-850d78618988",
        data: "01/08/2019",
      },
      {
        motivo: "6d39bbbb-574a-47b2-9c04-850d78618988",
        data: "02/08/2019",
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

  it("formata submissao inclusao de alimentacao normal", () => {
    const resposta = {
      inclusoes: [
        {
          data: "01/08/2019",
          motivo: "6d39bbbb-574a-47b2-9c04-850d78618988",
        },
        {
          data: "02/08/2019",
          motivo: "6d39bbbb-574a-47b2-9c04-850d78618988",
        },
      ],
      descricao: "<p>Descrição</p>",
      quantidades_periodo: [
        {
          checked: true,
          numero_alunos: "123",
          periodo_escolar: "73605a3b-7767-4ea6-845e-fef62f84dc1c",
          tipos_alimentacao: ["4c4b4d8e-6c32-456a-b1e5-524da9278629"],
          tipos_alimentacao_selecionados: [
            "4c4b4d8e-6c32-456a-b1e5-524da9278629",
          ],
          uuid: "73605a3b-7767-4ea6-845e-fef62f84dc1c",
        },
      ],
    };
    expect(
      formatarSubmissaoSolicitacaoNormal(
        solicitacaoInclusaoAlimentacaoNormal,
        meusDados
      )
    ).toEqual(resposta);
  });
});
