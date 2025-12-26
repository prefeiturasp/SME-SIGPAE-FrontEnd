export const mockLocationStateGrupoRecreioNasFerias = {
  periodo: null,
  grupo: "Recreio nas Férias",
  mesAnoSelecionado:
    "Wed Dec 03 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
  ehPeriodoEspecifico: false,
  tipos_alimentacao: [
    {
      uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
      nome: "Lanche 4h",
    },
    {
      uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
      nome: "Lanche",
    },
    {
      uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
      nome: "Refeição",
    },
    {
      uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
      nome: "Sobremesa",
    },
  ],
  status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  justificativa_periodo: null,
  periodosInclusaoContinua: null,
  solicitacaoMedicaoInicial: {
    escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
    escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
    tipos_contagem_alimentacao: [
      {
        nome: "Fichas Coloridas",
        ativo: true,
        uuid: "ecf37fa8-4f6c-4b55-9df3-868c12999015",
      },
    ],
    responsaveis: [
      {
        nome: "Responsavel AAAAS",
        rf: "3443242",
      },
    ],
    ocorrencia: null,
    logs: [
      {
        status_evento_explicacao: "Em aberto para preenchimento pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "ESCOLA EMEF ADMIN",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "15/12/2025 09:35:33",
        descricao:
          "Solicitação #BA4D3 -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 12/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
    alunos_periodo_parcial: [],
    historico: null,
    escola_eh_emebs: false,
    escola_cei_com_inclusao_parcial_autorizada: false,
    escola_possui_alunos_regulares: true,
    sem_lancamentos: false,
    justificativa_sem_lancamentos: null,
    justificativa_codae_correcao_sem_lancamentos: null,
    recreio_nas_ferias: {
      uuid: "69835919-9807-4496-9910-369f45aceaf0",
      id: 1,
      titulo: "Recreio nas férias - DEZ 2025",
      data_inicio: "03/12/2025",
      data_fim: "10/12/2025",
      unidades_participantes: [
        {
          id: 2,
          uuid: "283ccee7-1a25-4c73-899d-5f224740e557",
          num_inscritos: 100,
          num_colaboradores: 50,
          liberar_medicao: true,
          cei_ou_emei: "N/A",
          tipos_alimentacao: {
            colaboradores: [
              {
                uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
                nome: "Lanche 4h",
              },
              {
                uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
                nome: "Lanche",
              },
              {
                uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
                nome: "Refeição",
              },
              {
                uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
                nome: "Sobremesa",
              },
            ],
            inscritos: [
              {
                uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
                nome: "Lanche 4h",
              },
              {
                uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
                nome: "Lanche",
              },
              {
                uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
                nome: "Refeição",
              },
              {
                uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
                nome: "Sobremesa",
              },
            ],
          },
          unidade_educacional: {
            uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
            nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
            codigo_eol: "017981",
          },
          lote: {
            uuid: "655a63ff-dd0b-4259-86a0-cdd43ac36030",
            nome: "3567-3",
            nome_exibicao: "3567-3 - IP",
          },
        },
      ],
      criado_em: "15/12/2025 09:34:00",
      alterado_em: "17/12/2025 09:33:08",
    },
    criado_em: "15/12/2025 09:35:33",
    uuid: "ba4d34eb-eb38-4a31-8801-796964e1fde9",
    ano: "2025",
    mes: "12",
    status: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    com_ocorrencias: false,
    ue_possui_alunos_periodo_parcial: false,
    logs_salvos: false,
    dre_ciencia_correcao_data: null,
    rastro_lote: 21,
    rastro_terceirizada: 5,
    dre_ciencia_correcao_usuario: null,
    relatorio_financeiro: null,
  },
  periodoEspecifico: null,
  recreioNasFerias: true,
};
