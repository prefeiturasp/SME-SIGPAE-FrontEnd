export const mockSolicitacaoRecreioEMEF = {
  escola: "EMEF PERICLES EUGENIO DA SILVA RAMOS",
  escola_uuid: "3c32be8e-f191-468d-a4e2-3dd8751e5e7a",
  tipos_contagem_alimentacao: [
    {
      nome: "Balança (autosserviço)",
      ativo: true,
      uuid: "94993c31-6ba9-49db-9fb3-83326ba0209b",
    },
  ],
  responsaveis: [
    {
      nome: "Responsavel EMEF",
      rf: "3333333",
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
      criado_em: "18/02/2026 15:06:39",
      descricao:
        "Solicitação #EMEFR -- Escola EMEF PERICLES EUGENIO DA SILVA RAMOS -- 01/2026",
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
    uuid: "rec-emef-uuid-1111-2222-333333333333",
    id: 10,
    titulo: "Recreio nas Férias - JAN 2026",
    data_inicio: "02/01/2026",
    data_fim: "15/01/2026",
    unidades_participantes: [
      {
        id: 20,
        uuid: "part-emef-uuid-1111-2222-333333333333",
        num_inscritos: 80,
        num_colaboradores: 10,
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
          ],
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
          codigo_eol: "019455",
        },
        lote: {
          uuid: "3de37841-ef82-4e70-a05b-7246131fba54",
          nome: "12",
          nome_exibicao: "12 - IP",
        },
      },
    ],
    criado_em: "01/01/2026 02:00:01",
    alterado_em: "01/01/2026 02:00:01",
  },
  criado_em: "01/01/2026 02:00:01",
  uuid: "emef-recreio-uuid-1111-2222-333333333333",
  ano: "2026",
  mes: "01",
  status: "MEDICAO_ENVIADA_PELA_UE",
  com_ocorrencias: false,
  ue_possui_alunos_periodo_parcial: false,
  logs_salvos: false,
  dre_ciencia_correcao_data: null,
  rastro_lote: 21,
  rastro_terceirizada: 4,
  dre_ciencia_correcao_usuario: null,
  relatorio_financeiro: null,
};

export const mockSolicitacaoNormalEMEF = {
  ...mockSolicitacaoRecreioEMEF,
  uuid: "emef-normal-uuid-1111-2222-333333333333",
  recreio_nas_ferias: null,
  ano: "2026",
  mes: "01",
};
