export const mockCronogramaBase = {
  uuid: "cronograma-uuid-123",
  numero: "153/2024A",
  status: "Assinado",
  criado_em: "01/02/2024 14:38:30",
  alterado_em: "01/02/2024 14:38:30",
  contrato: {
    uuid: "contrato-uuid-123",
    numero: "837834",
    processo: "834783478",
    modalidade_display: "Pregão Eletrônico",
    numero_pregao: "12345",
    ata: "54321",
  },
  empresa: {
    uuid: "empresa-uuid-123",
    cnpj: "12345678901234",
    nome_fantasia: "JP Alimentos",
    razao_social: "JP Alimentos LTDA",
  },
  qtd_total_programada: 5000,
  unidade_medida: {
    uuid: "unidade-uuid-123",
    nome: "Quilograma",
    abreviacao: "kg",
  },
  armazem: {
    uuid: "armazem-uuid-123",
    nome_fantasia: "Distribuidor Central",
    razao_social: "Distribuidor Central LTDA",
    endereco: "Rua Teste",
    numero: "123",
    bairro: "Centro",
    estado: "SP",
    cep: "01000-000",
  },
  etapas: [
    {
      uuid: "etapa-uuid-1",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 1",
      data_programada: "15/03/2024",
      quantidade: 2500,
      total_embalagens: 100,
    },
    {
      uuid: "etapa-uuid-2",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 2",
      data_programada: "15/04/2024",
      quantidade: 2500,
      total_embalagens: 100,
    },
  ],
  programacoes_de_recebimento: [],
  ficha_tecnica: {
    uuid: "ficha-uuid-123",
    numero: "FT023",
    produto: {
      uuid: "produto-uuid-123",
      nome: "ARROZ TIPO I",
    },
    marca: {
      uuid: "marca-uuid-123",
      nome: "Marca Teste",
    },
    peso_liquido_embalagem_primaria: 1,
    peso_liquido_embalagem_secundaria: 25,
    unidade_medida_primaria: {
      abreviacao: "kg",
    },
    unidade_medida_secundaria: {
      abreviacao: "kg",
    },
  },
  tipo_embalagem_secundaria: {
    uuid: "embalagem-uuid-123",
    tipo_embalagem: "Secundária",
    abreviacao: "cx",
  },
  custo_unitario_produto: 12.5,
  observacoes: "",
};

export const mockSolicitacaoEmAnalise = {
  uuid: "solicitacao-uuid-em-analise",
  numero_solicitacao: "SOL-001/2024",
  criado_em: "10/03/2024 10:00:00",
  status: "Em análise",
  cronograma: mockCronogramaBase,
  justificativa:
    "Necessário ajustar entregas devido a mudanças no planejamento",
  etapas_antigas: mockCronogramaBase.etapas,
  etapas_novas: [
    {
      uuid: "etapa-nova-uuid-1",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 1",
      data_programada: "20/03/2024",
      quantidade: 3000,
      total_embalagens: 120,
    },
    {
      uuid: "etapa-nova-uuid-2",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 2",
      data_programada: "20/04/2024",
      quantidade: 2000,
      total_embalagens: 80,
    },
  ],
  logs: [
    {
      uuid: "log-uuid-1",
      status_evento_explicacao: "Em Análise",
      criado_em: "10/03/2024 10:00:00",
      usuario: {
        nome: "Fornecedor Teste",
      },
      justificativa: "",
    },
  ],
};

export const mockSolicitacaoCronogramaCiente = {
  ...mockSolicitacaoEmAnalise,
  uuid: "solicitacao-uuid-cronograma-ciente",
  numero_solicitacao: "SOL-001/2024",
  criado_em: "10/03/2024 10:00:00",
  status: "Cronograma ciente",
  logs: [
    ...mockSolicitacaoEmAnalise.logs,
    {
      uuid: "log-uuid-2",
      status_evento_explicacao: "Cronograma Ciente",
      criado_em: "11/03/2024 14:30:00",
      usuario: {
        nome: "Cronograma Teste",
      },
      justificativa: "Análise do cronograma: alterações aprovadas",
    },
  ],
};

export const mockSolicitacaoAprovadaAbastecimento = {
  ...mockSolicitacaoCronogramaCiente,
  uuid: "solicitacao-uuid-aprovada-abastecimento",
  status: "Aprovado Abastecimento",
  logs: [
    ...mockSolicitacaoCronogramaCiente.logs,
    {
      uuid: "log-uuid-3",
      status_evento_explicacao: "Aprovado Abastecimento",
      criado_em: "12/03/2024 09:15:00",
      usuario: {
        nome: "Abastecimento Teste",
      },
      justificativa: "",
    },
  ],
};

export const mockSolicitacaoReprovadaAbastecimento = {
  ...mockSolicitacaoCronogramaCiente,
  uuid: "solicitacao-uuid-reprovada-abastecimento",
  status: "Reprovado Abastecimento",
  logs: [
    ...mockSolicitacaoCronogramaCiente.logs,
    {
      uuid: "log-uuid-3",
      status_evento_explicacao: "Reprovado Abastecimento",
      criado_em: "12/03/2024 09:15:00",
      usuario: {
        nome: "Abastecimento Teste",
      },
      justificativa: "Quantidades não estão de acordo com a demanda prevista",
    },
  ],
};

export const mockSolicitacaoAprovadaDilog = {
  ...mockSolicitacaoAprovadaAbastecimento,
  uuid: "solicitacao-uuid-aprovada-dilog",
  status: "Aprovado DILOG",
  logs: [
    ...mockSolicitacaoAprovadaAbastecimento.logs,
    {
      uuid: "log-uuid-4",
      status_evento_explicacao: "Aprovado DILOG",
      criado_em: "13/03/2024 11:20:00",
      usuario: {
        nome: "DILOG Teste",
      },
      justificativa: "",
    },
  ],
};

export const mockSolicitacaoReprovadaDilog = {
  ...mockSolicitacaoAprovadaAbastecimento,
  uuid: "solicitacao-uuid-reprovada-dilog",
  status: "Reprovado DILOG",
  logs: [
    ...mockSolicitacaoAprovadaAbastecimento.logs,
    {
      uuid: "log-uuid-4",
      status_evento_explicacao: "Reprovado DILOG",
      criado_em: "13/03/2024 11:20:00",
      usuario: {
        nome: "DILOG Teste",
      },
      justificativa: "Necessário revisar datas de entrega",
    },
  ],
};

export const mockSolicitacaoAlteracaoCodae = {
  uuid: "solicitacao-uuid-alteracao-codae",
  numero_solicitacao: "SOL-002/2024",
  criado_em: "14/03/2024 15:00:00",
  status: "Alteração Enviada ao Fornecedor",
  cronograma: mockCronogramaBase,
  justificativa: "Alteração realizada pela CODAE para ajuste de cronograma",
  etapas_antigas: mockCronogramaBase.etapas,
  etapas_novas: [
    {
      uuid: "etapa-nova-uuid-3",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 1",
      data_programada: "01/04/2024",
      quantidade: 2000,
      total_embalagens: 80,
    },
    {
      uuid: "etapa-nova-uuid-4",
      numero_empenho: "2024001",
      qtd_total_empenho: 5000,
      etapa: "Etapa 1",
      parte: "Parte 2",
      data_programada: "01/05/2024",
      quantidade: 3000,
      total_embalagens: 120,
    },
  ],
  logs: [
    {
      uuid: "log-uuid-5",
      status_evento_explicacao: "Alteração Enviada ao Fornecedor",
      criado_em: "14/03/2024 15:00:00",
      usuario: {
        nome: "CODAE Teste",
      },
      justificativa: "Alteração realizada pela CODAE para ajuste de cronograma",
    },
  ],
};

export const mockSolicitacaoFornecedorCiente = {
  ...mockSolicitacaoAlteracaoCodae,
  uuid: "solicitacao-uuid-fornecedor-ciente",
  status: "Fornecedor Ciente",
  logs: [
    ...mockSolicitacaoAlteracaoCodae.logs,
    {
      uuid: "log-uuid-6",
      status_evento_explicacao: "Fornecedor Ciente",
      criado_em: "15/03/2024 10:30:00",
      usuario: {
        nome: "Fornecedor Teste",
      },
      justificativa: "",
    },
  ],
};

export const mockOpcoesEtapas = [
  {
    uuid: 1,
    value: "Etapa 1",
  },
  {
    uuid: 2,
    value: "Etapa 2",
  },
  {
    uuid: 3,
    value: "Etapa 3",
  },
  {
    uuid: 4,
    value: "Etapa 4",
  },
  {
    uuid: 5,
    value: "Etapa 5",
  },
  {
    uuid: 6,
    value: "Etapa 6",
  },
  {
    uuid: 7,
    value: "Etapa 7",
  },
  {
    uuid: 8,
    value: "Etapa 8",
  },
  {
    uuid: 9,
    value: "Etapa 9",
  },
  {
    uuid: 10,
    value: "Etapa 10",
  },
];

export const mockFeriados = {
  results: ["2024-12-25", "2024-01-01"],
};
