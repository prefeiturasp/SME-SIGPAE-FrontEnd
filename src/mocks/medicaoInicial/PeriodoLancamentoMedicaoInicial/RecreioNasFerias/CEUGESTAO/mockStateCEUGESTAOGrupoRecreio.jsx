export const mockLocationStateGrupoRecreioNasFerias = {
  periodo: null,
  grupo: "Recreio nas Férias",
  mesAnoSelecionado:
    "Mon Dec 15 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)",
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
  ],
  status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  status_solicitacao: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
  justificativa_periodo: null,
  periodosInclusaoContinua: null,
  solicitacaoMedicaoInicial: {
    escola: "CEU GESTAO INACIO MONTEIRO",
    escola_uuid: "49e6bf7f-36ad-418b-a5ec-2b03442aba22",
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
          uuid: "768bda20-5a09-4c50-ad14-40880933ec4b",
          cpf: null,
          nome: "ESCOLA CEU GESTAO ADMIN",
          email: "ceugestao@admin.com",
          date_joined: "23/06/2022 14:33:56",
          registro_funcional: "1597584",
          tipo_usuario: "escola",
          cargo: "ADMINISTRADOR",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "18/12/2025 08:54:44",
        descricao:
          "Solicitação #1178B -- Escola CEU GESTAO INACIO MONTEIRO -- 12/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
    alunos_periodo_parcial: [],
    historico: null,
    escola_eh_emebs: false,
    escola_cei_com_inclusao_parcial_autorizada: false,
    escola_possui_alunos_regulares: false,
    sem_lancamentos: false,
    justificativa_sem_lancamentos: null,
    justificativa_codae_correcao_sem_lancamentos: null,
    recreio_nas_ferias: {
      uuid: "26380235-353a-4639-a704-f1b6b1971399",
      id: 2,
      titulo: "Recreio nas Férias - DEZ 2025",
      data_inicio: "15/12/2025",
      data_fim: "30/12/2025",
      unidades_participantes: [
        {
          id: 3,
          uuid: "bbdd5bfc-812a-4703-94c4-ae2fbf37fba6",
          num_inscritos: 100,
          num_colaboradores: 10,
          liberar_medicao: true,
          cei_ou_emei: "N/A",
          tipos_alimentacao: {
            inscritos: [
              {
                uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
                nome: "Lanche 4h",
              },
              {
                uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
                nome: "Lanche",
              },
            ],
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
          },
          unidade_educacional: {
            uuid: "49e6bf7f-36ad-418b-a5ec-2b03442aba22",
            nome: "CEU GESTAO INACIO MONTEIRO",
            codigo_eol: "200189",
          },
          lote: {
            uuid: "43ee38d2-0516-478d-a37a-90109aa4e447",
            nome: "3567-1",
            nome_exibicao: "3567-1 - IP",
          },
        },
      ],
      criado_em: "18/12/2025 08:49:38",
      alterado_em: "18/12/2025 08:49:38",
    },
    criado_em: "18/12/2025 08:54:44",
    uuid: "1178b8ea-4554-4fe5-ae9a-d293e70f4851",
    ano: "2025",
    mes: "12",
    status: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
    com_ocorrencias: false,
    ue_possui_alunos_periodo_parcial: false,
    logs_salvos: false,
    dre_ciencia_correcao_data: null,
    rastro_lote: 10,
    rastro_terceirizada: 5,
    dre_ciencia_correcao_usuario: null,
    relatorio_financeiro: null,
  },
  periodoEspecifico: null,
  recreioNasFerias: true,
};
