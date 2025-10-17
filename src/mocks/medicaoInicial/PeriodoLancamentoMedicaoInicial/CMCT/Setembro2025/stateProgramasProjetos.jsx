export const mockStateCMCTProgramasProjetosSetembro2025 = {
  periodo: null,
  grupo: "Programas e Projetos",
  mesAnoSelecionado: "2025-09-01T03:00:00.000Z",
  ehPeriodoEspecifico: false,
  tipos_alimentacao: [
    {
      nome: "Lanche 4h",
      uuid: "83fefd96-e476-42a0-81fc-75b9853b726c",
      posicao: 1,
    },
    {
      nome: "Lanche",
      uuid: "5d1304c8-77a8-4c96-badb-dd2e8c1b76d5",
      posicao: 2,
    },
    {
      nome: "Refeição",
      uuid: "65f11f11-630b-4629-bb17-07c875c548f1",
      posicao: 2,
    },
    {
      nome: "Sobremesa",
      uuid: "5aa2c32b-1df2-46b6-b2e7-514b885fa9a4",
      posicao: 4,
    },
    {
      nome: "Lanche Emergencial",
      uuid: "c4255a14-85fd-412f-b35f-30828215e4d5",
      posicao: null,
    },
  ],
  status_periodo: "MEDICAO_CORRECAO_SOLICITADA",
  status_solicitacao: "MEDICAO_CORRECAO_SOLICITADA",
  justificativa_periodo: "<p>dasdas</p>",
  periodosInclusaoContinua: {
    TARDE: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
  },
  solicitacaoMedicaoInicial: {
    escola: "CMCT VANDYR DA SILVA, PROF",
    escola_uuid: "f206b315-fa30-4768-9fa6-07b952800284",
    tipos_contagem_alimentacao: [
      {
        nome: "Contagem de Utensílios",
        ativo: true,
        uuid: "d1027ac7-439f-4d5c-b010-d50d8eed2b40",
      },
    ],
    responsaveis: [
      {
        nome: "teste",
        rf: "1234567",
      },
    ],
    ocorrencia: null,
    logs: [
      {
        status_evento_explicacao: "Em aberto para preenchimento pela UE",
        usuario: {
          uuid: "e6191cb1-6b55-45dc-a4a4-b4e59729ad8a",
          cpf: null,
          nome: "ESCOLA CMCT TESTE",
          email: "escolacmct@admin.com",
          date_joined: "17/02/2025 12:08:51",
          registro_funcional: null,
          tipo_usuario: "escola",
          cargo: "",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "15/10/2025 11:46:18",
        descricao:
          "Solicitação #BD69F -- Escola CMCT VANDYR DA SILVA, PROF -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Enviado pela UE",
        usuario: {
          uuid: "e6191cb1-6b55-45dc-a4a4-b4e59729ad8a",
          cpf: null,
          nome: "ESCOLA CMCT TESTE",
          email: "escolacmct@admin.com",
          date_joined: "17/02/2025 12:08:51",
          registro_funcional: null,
          tipo_usuario: "escola",
          cargo: "",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "15/10/2025 14:58:29",
        descricao:
          "Solicitação #BD69F -- Escola CMCT VANDYR DA SILVA, PROF -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
      {
        status_evento_explicacao: "Correção solicitada",
        usuario: {
          uuid: "d4148ab8-6da9-4b24-9468-74f406d97490",
          cpf: null,
          nome: "DRE SAO MIGUEL",
          email: "dresaomiguel@admin.com",
          date_joined: "04/10/2023 15:13:22",
          registro_funcional: null,
          tipo_usuario: "diretoriaregional",
          cargo: "",
          crn_numero: null,
          nome_fantasia: null,
        },
        criado_em: "17/10/2025 14:46:21",
        descricao:
          "Solicitação #BD69F -- Escola CMCT VANDYR DA SILVA, PROF -- 09/2025",
        justificativa: "",
        resposta_sim_nao: false,
      },
    ],
    alunos_periodo_parcial: [],
    historico: [
      {
        usuario: {
          uuid: "d4148ab8-6da9-4b24-9468-74f406d97490",
          nome: "DRE SAO MIGUEL",
          username: "59652454087",
          email: "dresaomiguel@admin.com",
        },
        criado_em: "16/10/2025 15:53:25",
        acao: "MEDICAO_CORRECAO_SOLICITADA",
        alteracoes: [
          {
            periodo_escolar: "MANHA",
            justificativa: "<p>arruma o dia 2 ai bro</p>",
            tabelas_lancamentos: [
              {
                categoria_medicao: "ALIMENTAÇÃO",
                semanas: [
                  {
                    semana: "1",
                    dias: ["02"],
                  },
                ],
              },
              {
                categoria_medicao: "DIETA ESPECIAL - TIPO B",
                semanas: [
                  {
                    semana: "1",
                    dias: ["02"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        usuario: {
          uuid: "e6191cb1-6b55-45dc-a4a4-b4e59729ad8a",
          nome: "ESCOLA CMCT TESTE",
          username: "98919692076",
          email: "escolacmct@admin.com",
        },
        criado_em: "16/10/2025 15:54:43",
        acao: "MEDICAO_CORRIGIDA_PELA_UE",
        alteracoes: [
          {
            periodo_escolar: "MANHA",
            tabelas_lancamentos: [
              {
                categoria_medicao: "ALIMENTAÇÃO",
                semanas: [
                  {
                    semana: "1",
                    dias: [
                      {
                        dia: "02",
                        campos: [
                          {
                            campo_nome: "frequencia",
                            de: "90",
                            para: "91",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        usuario: {
          uuid: "d4148ab8-6da9-4b24-9468-74f406d97490",
          nome: "DRE SAO MIGUEL",
          username: "59652454087",
          email: "dresaomiguel@admin.com",
        },
        criado_em: "16/10/2025 15:55:41",
        acao: "MEDICAO_APROVADA_PELA_DRE",
        alteracoes: [
          {
            periodo_escolar: "MANHA",
          },
        ],
      },
      {
        usuario: {
          uuid: "d4148ab8-6da9-4b24-9468-74f406d97490",
          nome: "DRE SAO MIGUEL",
          username: "59652454087",
          email: "dresaomiguel@admin.com",
        },
        criado_em: "17/10/2025 14:46:21",
        acao: "MEDICAO_CORRECAO_SOLICITADA",
        alteracoes: [
          {
            periodo_escolar: "Programas e Projetos",
            justificativa: "<p>dasdas</p>",
            tabelas_lancamentos: [
              {
                categoria_medicao: "ALIMENTAÇÃO",
                semanas: [
                  {
                    semana: "1",
                    dias: ["03"],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    escola_eh_emebs: false,
    escola_cei_com_inclusao_parcial_autorizada: false,
    escola_possui_alunos_regulares: false,
    sem_lancamentos: false,
    justificativa_sem_lancamentos: null,
    justificativa_codae_correcao_sem_lancamentos: null,
    criado_em: "15/10/2025 11:46:18",
    uuid: "bd69f3c8-33bb-42b2-86e8-db2f60d2a7d3",
    ano: "2025",
    mes: "09",
    status: "MEDICAO_CORRECAO_SOLICITADA",
    com_ocorrencias: false,
    ue_possui_alunos_periodo_parcial: false,
    logs_salvos: false,
    dre_ciencia_correcao_data: null,
    rastro_lote: 22,
    rastro_terceirizada: 434,
    dre_ciencia_correcao_usuario: null,
    relatorio_financeiro: null,
  },
  frequenciasDietasEscolaSemAlunoRegular: [
    {
      categoria_medicao: 4,
      nome_campo: "frequencia",
      valor: "2",
      dia: "02",
      medicao_uuid: "6308f145-ac7b-47fb-8043-abc94a09924b",
      faixa_etaria: null,
      faixa_etaria_str: null,
      faixa_etaria_inicio: null,
      uuid: "da26c1ea-aacf-4f62-bb76-b1f5ff162f2e",
      medicao_alterado_em: "16/10/2025, às 15:54:45",
      habilitado_correcao: false,
      infantil_ou_fundamental: "N/A",
    },
  ],
  periodoEspecifico: null,
  veioDoAcompanhamentoDeLancamentos: true,
  status: "Correção solicitada DRE",
};
