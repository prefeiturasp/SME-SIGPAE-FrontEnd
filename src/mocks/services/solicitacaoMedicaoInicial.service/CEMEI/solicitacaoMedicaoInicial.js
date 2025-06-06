export const mockSolicitacaoMedicaoInicialCEMEI = [
  {
    escola: "CEMEI SUZANA CAMPOS TAUIL",
    escola_uuid: "68b35061-9942-4aa2-9cbf-88363127688e",
    tipos_contagem_alimentacao: [
      {
        nome: "Balança (autosserviço)",
        ativo: true,
        uuid: "3632dfd4-86ce-47ad-a82f-7f83ea417dc8",
      },
      {
        nome: "Catraca",
        ativo: true,
        uuid: "dad2143c-a05a-4f81-9e73-89577523eb81",
      },
      {
        nome: "Contagem de Utensílios",
        ativo: true,
        uuid: "0d34a58b-4e54-4bc4-9885-2b4ad757092b",
      },
    ],
    responsaveis: [
      {
        nome: "Fulano",
        rf: "1234567",
      },
    ],
    ocorrencia: null,
    logs: [
      {
        status_evento_explicacao: "Em aberto para preenchimento pela UE",
        usuario: {
          uuid: "b820d205-7e39-451f-97cc-76c63a81c11c",
          cpf: null,
          nome: "ESCOLA CEMEI TESTE",
          email: "escolacemei@admin.com",
          date_joined: "01/11/2022 10:21:03",
          registro_funcional: null,
          tipo_usuario: "escola",
          cargo: "",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "24/03/2025 14:38:30",
        descricao:
          "Solicitação #F4AF6 -- Escola CEMEI SUZANA CAMPOS TAUIL -- 08/2024",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
    alunos_periodo_parcial: [
      {
        uuid: "66940025-8eb1-457f-a25f-0cdc710793e1",
        nome: "FULANO SILVA",
        codigo_eol: "9999999",
        escola: "68b35061-9942-4aa2-9cbf-88363127688e",
        data: "01/08/2024",
        data_removido: null,
      },
      {
        uuid: "70b4031e-1430-4252-91e7-7dbed23db323",
        nome: "FULANA SOUZA",
        codigo_eol: "8888888",
        escola: "68b35061-9942-4aa2-9cbf-88363127688e",
        data: "01/08/2024",
        data_removido: null,
      },
      {
        uuid: "1c78a44d-ce6a-4751-a94f-e48de0cc5af5",
        nome: "BELTRANO SANTOS",
        codigo_eol: "7777777",
        escola: "68b35061-9942-4aa2-9cbf-88363127688e",
        data: "01/08/2024",
        data_removido: null,
      },
    ],
    historico: null,
    escola_eh_emebs: false,
    escola_cei_com_inclusao_parcial_autorizada: false,
    criado_em: "24/03/2025 14:38:26",
    uuid: "f4af6d53-e222-4f62-b4d8-bcd7a52b504e",
    ano: "2024",
    mes: "08",
    status: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    com_ocorrencias: false,
    ue_possui_alunos_periodo_parcial: true,
    logs_salvos: false,
    dre_ciencia_correcao_data: null,
    rastro_lote: 8,
    rastro_terceirizada: 10,
    dre_ciencia_correcao_usuario: null,
    relatorio_financeiro: null,
  },
];
