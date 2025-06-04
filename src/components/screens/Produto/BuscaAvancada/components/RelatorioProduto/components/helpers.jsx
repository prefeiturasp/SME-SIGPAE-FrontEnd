export const produto = {
  protocolos: [],
  marca: {
    nome: "XXXXXXXXXXXXX",
    uuid: "ce8d08f8-5a55-406f-a3b0-9fdc4376e503",
  },
  fabricante: {
    nome: "XXXXXXXXXXXXXXXXXXXXXX",
    uuid: "cb9ee8ca-031e-4fb1-9c1c-a1dc75c78bf2",
  },
  imagens: [],
  informacoes_nutricionais: [
    {
      informacao_nutricional: {
        tipo_nutricional: {
          nome: "XXXXXXXXXXXXXXXXXXXXXX",
          uuid: "7995c8e0-bf52-4a62-8b57-bc460b298d66",
        },
        nome: "XXXXXXXXXXXXXXXXXXXXXX",
        uuid: "e3f8dc79-57f0-4953-8d62-b817ab7665e5",
        medida: "KCAL",
      },
      uuid: "9a92d242-c699-4cb2-9082-bed3a1a0f644",
      quantidade_porcao: "1,1",
      valor_diario: "1",
    },
  ],
  homologacoes: [
    {
      uuid: "6d296178-159c-4f12-8764-2b6636f30d7c",
      status: "CODAE_PENDENTE_HOMOLOGACAO",
      id_externo: "6D296",
      rastro_terceirizada: {
        uuid: "9ed8dbcc-da15-4c95-98eb-88ed8cfb6742",
        cnpj: "05951758000129",
        nome_fantasia: "SINGULAR GESTÃO DE SERVIÇOS LTDA",
        contatos: [
          {
            telefone: "119999999",
            telefone2: "1199999999",
            celular: "1199999999",
            email: "admin@admin.com",
          },
        ],
      },
      logs: [
        {
          status_evento_explicacao: "Solicitação Realizada",
          usuario: {
            uuid: "02867188-c33d-44c1-8703-02fcf3c12160",
            cpf: "11111111113",
            nome: "SUPER USUARIO TERCEIRIZADA",
            email: "terceirizada@admin.com",
            date_joined: "28/04/2020 16:54:17",
            registro_funcional: "0000100",
            tipo_usuario: "terceirizada",
          },
          criado_em: "28/04/2020 17:15:34",
          descricao: "Homologação #6D296",
          justificativa: "",
          resposta_sim_nao: false,
        },
      ],
      criado_em: "28/04/2020 17:15:34",
    },
  ],
  nome: "XXXXXXXXXXXXXXXXXXXXXX",
  ativo: false,
  criado_em: "XX/XX/XXXX 17:15:34",
  uuid: "8ab10246-071a-47dd-a49e-35d28cd1f4b5",
  eh_para_alunos_com_dieta: false,
  componentes: "XXXXXXXXXXXXXXXXXXXXXX",
  tem_aditivos_alergenicos: false,
  aditivos: "",
  tipo: "XXXXXXXXXXXXXXXXXXXXXX",
  embalagem: "XXXXXXXXXXXXXXXXXXXXXX",
  prazo_validade: "XXXXXXXXXXXXXXXXXXXXXX",
  info_armazenamento: "XXXXXXXXXXXXXXXXXXXXXX",
  outras_informacoes: "XXXXXXXXXXXXXXXXXXXXXX",
  numero_registro: "XXXXXXXXXXXXXXXXXXXXXX",
  porcao: "XXXXXXXXXXXXXXXXXXXXXX",
  unidade_caseira: "XXXXXXXXXXXXXXXXXXXXXX",
  criado_por: 4,
  status: "XXXXXXXXXXXXXXXXXXXXXX",

  ultima_homologacao: {
    uuid: "6d296178-159c-4f12-8764-2b6636f30d7c",
    status: "CODAE_PENDENTE_HOMOLOGACAO",
    id_externo: "6D296",
    rastro_terceirizada: {
      uuid: "9ed8dbcc-da15-4c95-98eb-88ed8cfb6742",
      cnpj: "05951758000129",
      nome_fantasia: "XXXXXXXXXXXXXXXXXXXXXX",
      contatos: [
        {
          telefone: "XXXXXXXXXX",
          telefone2: "1199999999",
          celular: "1199999999",
          email: "XXXXXXXXXXXXX@XXXXXXXX.XXX",
        },
      ],
    },
    logs: [
      {
        status_evento_explicacao: "Solicitação Realizada",
        usuario: {
          uuid: "02867188-c33d-44c1-8703-02fcf3c12160",
          cpf: "11111111113",
          nome: "SUPER USUARIO TERCEIRIZADA",
          email: "terceirizada@admin.com",
          date_joined: "28/04/2020 16:54:17",
          registro_funcional: "0000100",
          tipo_usuario: "terceirizada",
        },
        criado_em: "28/04/2020 17:15:34",
        descricao: "Homologação #6D296",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
    criado_em: "28/04/2020 17:15:34",
  },
};

export const logs = [
  {
    status_evento_explicacao: "Solicitação Realizada",
    usuario: {
      uuid: "02867188-c33d-44c1-8703-02fcf3c12160",
      cpf: "99999999999",
      nome: "USUARIO TERCEIRIZADA",
      email: "xxxxxxxxxxxx@xxxx.xxx",
      registro_funcional: "0214563",
      tipo_usuario: "xxxxxxxxxxxx",
    },
    criado_em: "28/04/2020 17:15:34",
    descricao: "Homologação #6D296",
    justificativa: "",
    resposta_sim_nao: false,
    ativo: false,
  },
  {
    status_evento_explicacao: "Homologado",
    usuario: {
      uuid: "02867188-c33d-44c1-8703-02fcf3c12160",
      cpf: "99999999999",
      nome: "USUARIO CODAE",
      email: "xxxxxxxxxxxx@xxxx.xxx",
      registro_funcional: "0546986",
      tipo_usuario: "xxxxxxxxxxxx",
    },
    criado_em: "28/04/2020 17:15:34",
    descricao: "Homologação #6D296",
    justificativa: "",
    resposta_sim_nao: false,
    ativo: false,
  },
];

export const informacoesNutricionais = [
  {
    nome: "CALORIA",
    ativo: false,
  },
  {
    nome: "CARBOIDRATOS",
    ativo: false,
  },
  {
    nome: "PROTEINAS",
    ativo: false,
  },
  {
    nome: "GORDURAS",
    ativo: false,
  },
  {
    nome: "FIBRAS",
    ativo: false,
  },
  {
    nome: "VITAMINAS E MINERAIS",
    ativo: false,
  },
];
