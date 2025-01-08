import { formatarSubmissao } from "../helper";

describe("Teste formatarSubmissão Solicitação Unificada", () => {
  const formValues = {
    data: "17/12/2024",
    local: "Ibirapuera",
    evento: "Piquenique",
    unidades_escolares: [
      {
        uuid: "507b804f-1b69-4cb1-b4b6-b6e32ca27044",
        kits_selecionados: ["3ca3356d-a368-4d30-b519-3f84d9ed607a"],
        nmr_alunos: "100",
        quantidade_kits: "1",
      },
      {
        uuid: "c3f86b1c-9fb2-4652-8a6a-2fe6c9f3bcb5",
        kits_selecionados: [
          "7bc52e81-c2c0-4c2e-8b71-4dfe32dbf5bf",
          "c822d7d7-8e2b-403f-9b64-50f2c690c6b9",
        ],
        nmr_alunos: "200",
        quantidade_kits: "2",
      },
    ],
  };
  const dadosUsuario = {
    vinculo_atual: {
      instituicao: {
        uuid: "d277fd64-1f1a-4116-811f-890c7f07b4a3",
      },
    },
  };

  it("formata submissao com kit lanches", () => {
    const resposta = {
      local: "Ibirapuera",
      evento: "Piquenique",
      diretoria_regional: "d277fd64-1f1a-4116-811f-890c7f07b4a3",
      lista_kit_lanche_igual: false,
      escolas_quantidades: [
        {
          escola: "507b804f-1b69-4cb1-b4b6-b6e32ca27044",
          kits: ["3ca3356d-a368-4d30-b519-3f84d9ed607a"],
          quantidade_alunos: "100",
          tempo_passeio: 0,
        },
        {
          escola: "c3f86b1c-9fb2-4652-8a6a-2fe6c9f3bcb5",
          kits: [
            "7bc52e81-c2c0-4c2e-8b71-4dfe32dbf5bf",
            "c822d7d7-8e2b-403f-9b64-50f2c690c6b9",
          ],
          quantidade_alunos: "200",
          tempo_passeio: 1,
        },
      ],
      solicitacao_kit_lanche: {
        data: "17/12/2024",
        descricao: "<p></p>",
        kits: [],
      },
    };
    expect(formatarSubmissao(formValues, dadosUsuario)).toEqual(resposta);
  });
});
