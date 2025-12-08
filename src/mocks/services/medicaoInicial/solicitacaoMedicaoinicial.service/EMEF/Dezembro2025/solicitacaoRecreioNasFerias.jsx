export const mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF = [
  {
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
        nome: "dsadas",
        rf: "1231231",
      },
    ],
    ocorrencia: null,
    logs: [
      {
        status_evento_explicacao: "Em aberto para preenchimento pela UE",
        usuario: {
          uuid: "36750ded-5790-433e-b765-0507303828df",
          cpf: null,
          nome: "SUPER USUARIO ESCOLA EMEF",
          email: "escolaemef@admin.com",
          date_joined: "10/07/2020 13:15:23",
          registro_funcional: "8115257",
          tipo_usuario: "escola",
          cargo: "ANALISTA DE SAUDE NIVEL II",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "08/12/2025 14:06:47",
        descricao:
          "Solicitação #AC6F6 -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 12/2025",
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
      uuid: "0e3cdb48-3a82-47e6-9263-300d478c6934",
      id: 44,
      titulo: "Recreio nas Férias - Dez 25",
      data_inicio: "08/12/2025",
      data_fim: "25/12/2025",
      unidades_participantes: [
        {
          id: 137,
          uuid: "4b1e192e-ba47-4849-be7b-ce00f5e0a98f",
          num_inscritos: 100,
          num_colaboradores: 1,
          liberar_medicao: true,
          cei_ou_emei: "N/A",
          tipos_alimentacao: {
            inscritos: [
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
      criado_em: "08/12/2025 10:51:07",
      alterado_em: "08/12/2025 10:51:07",
    },
    criado_em: "08/12/2025 14:06:47",
    uuid: "ac6f6067-348e-457e-a4bd-ba7d6047d899",
    ano: "2025",
    mes: "12",
    status: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    com_ocorrencias: false,
    ue_possui_alunos_periodo_parcial: false,
    logs_salvos: false,
    dre_ciencia_correcao_data: null,
    rastro_lote: 21,
    rastro_terceirizada: 4,
    dre_ciencia_correcao_usuario: null,
    relatorio_financeiro: null,
  },
];
