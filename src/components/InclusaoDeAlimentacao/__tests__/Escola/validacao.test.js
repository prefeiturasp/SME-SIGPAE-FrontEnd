import {
  validarSubmissaoContinua,
  validarSubmissaoNormal,
} from "components/InclusaoDeAlimentacao/Escola/Formulario/validacao";

const values = {
  escola: "b5e1f9b4-d5f3-44bb-9018-57d0c78b2e8a",
  inclusoes: [
    {
      data: "20/02/2025",
      motivo: "1d96f81f-3db2-4c23-9e74-150c2e0872bb",
    },
  ],
  quantidades_periodo: [
    {
      checked: false,
      dias_semana: [],
      maximo_alunos: 311,
      multiselect: "multiselect-wrapper-disabled",
      nome: "MANHA",
      numero_alunos: null,
      posicao: null,
      possui_alunos_regulares: true,
      tipo_turno: 1,
      tipos_alimentacao: [
        {
          nome: "Lanche",
          uuid: "685ce431-dd9f-4eaf-89af-7027929707fb",
          posicao: 4,
        },
        {
          nome: "Refeição",
          uuid: "6b2ed407-ca7d-4849-9ee1-46de89056efc",
          posicao: 6,
        },
        {
          nome: "Sobremesa",
          uuid: "af8a89ec-59be-4bed-b81c-348d4e70957d",
          posicao: 7,
        },
      ],
      tipos_alimentacao_selecionados: [],
      uuid: "ce7f3cb2-a216-4931-a04a-43dbcf690a84",
    },
    {
      checked: false,
      dias_semana: [],
      maximo_alunos: 222,
      multiselect: "multiselect-wrapper-disabled",
      nome: "TARDE",
      numero_alunos: null,
      posicao: null,
      possui_alunos_regulares: true,
      tipo_turno: 3,
      tipos_alimentacao: [
        {
          nome: "Lanche",
          uuid: "685ce431-dd9f-4eaf-89af-7027929707fb",
          posicao: 4,
        },
        {
          nome: "Refeição",
          uuid: "6b2ed407-ca7d-4849-9ee1-46de89056efc",
          posicao: 6,
        },
        {
          nome: "Sobremesa",
          uuid: "af8a89ec-59be-4bed-b81c-348d4e70957d",
          posicao: 7,
        },
      ],
      tipos_alimentacao_selecionados: [],
      uuid: "a12d4887-372a-4452-938b-abd78f6cc466",
    },
  ],
};

const meusDados = {
  vinculo_atual: {
    instituicao: {
      tipo_unidade_escolar_iniciais: "EMEF",
      quantidade_alunos: 533,
    },
  },
};

describe("teste validarSubmissaoNormal", () => {
  test("retorna erro `Necessário selecionar ao menos um período`", () => {
    expect(validarSubmissaoNormal(values, meusDados, false)).toEqual(
      "Necessário selecionar ao menos um período"
    );
  });

  test("retorna erro `Selecione ao menos um tipo de alimentação no(s) período(s) MANHA`", () => {
    values["quantidades_periodo"][0]["checked"] = true;

    expect(validarSubmissaoNormal(values, meusDados, false)).toEqual(
      "Selecione ao menos um tipo de alimentação no(s) período(s) MANHA"
    );
  });

  test("retorna erro `Selecione ao menos um tipo de alimentação no(s) período(s) MANHA, TARDE`", () => {
    values["quantidades_periodo"][0]["checked"] = true;
    values["quantidades_periodo"][1]["checked"] = true;

    expect(validarSubmissaoNormal(values, meusDados, false)).toEqual(
      "Selecione ao menos um tipo de alimentação no(s) período(s) MANHA,TARDE"
    );
  });

  test("retorna erro `Número total de alunos do pedido ultrapassa quantidade de alunos da escola`", () => {
    values["quantidades_periodo"][0]["checked"] = true;
    values["quantidades_periodo"][0]["numero_alunos"] = 300;
    values["quantidades_periodo"][0]["tipos_alimentacao_selecionados"] = [
      "685ce431-dd9f-4eaf-89af-7027929707fb",
    ];

    values["quantidades_periodo"][1]["checked"] = true;
    values["quantidades_periodo"][1]["numero_alunos"] = 300;
    values["quantidades_periodo"][1]["tipos_alimentacao_selecionados"] = [
      "685ce431-dd9f-4eaf-89af-7027929707fb",
    ];

    expect(validarSubmissaoNormal(values, meusDados, false)).toEqual(
      "Número total de alunos do pedido ultrapassa quantidade de alunos da escola"
    );
  });
});

describe("teste validarSubmissaoContinua", () => {
  test("retorna erro `Necessário adicionar ao menos uma recorrência`", () => {
    expect(validarSubmissaoContinua({}, meusDados, false)).toEqual(
      "Necessário adicionar ao menos uma recorrência"
    );
  });

  test("retorna erro `Número total de alunos do pedido ultrapassa quantidade de alunos da escola`", () => {
    values["quantidades_periodo"][0]["checked"] = true;
    values["quantidades_periodo"][0]["numero_alunos"] = 300;
    values["quantidades_periodo"][0]["tipos_alimentacao_selecionados"] = [
      "685ce431-dd9f-4eaf-89af-7027929707fb",
    ];

    values["quantidades_periodo"][1]["checked"] = true;
    values["quantidades_periodo"][1]["numero_alunos"] = 300;
    values["quantidades_periodo"][1]["tipos_alimentacao_selecionados"] = [
      "685ce431-dd9f-4eaf-89af-7027929707fb",
    ];

    expect(validarSubmissaoContinua(values, meusDados, false)).toEqual(
      "Número total de alunos do pedido ultrapassa quantidade de alunos da escola"
    );
  });
});
