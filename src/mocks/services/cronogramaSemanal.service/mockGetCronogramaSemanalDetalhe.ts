export const mockCronogramaSemanalDetalhe = {
  uuid: "12345678-1234-1234-1234-123456789012",
  numero: "CSW-001",
  status: "Rascunho",
  observacoes: "Observações do cronograma semanal",
  cronograma_mensal: {
    uuid: "44bfa8b7-92ba-4628-a35b-1b222f6510bd",
    numero: "053/2023",
    empresa: {
      uuid: "d0630b2b-8e45-472c-b9c6-90451b60b081",
      nome_fantasia: "JP Alimentos",
      razao_social: "JP Alimentos LTDA",
    },
    contrato: {
      uuid: "387121e0-f887-4ecf-9521-00c519e9830d",
      numero: "837834",
      processo: "834783478",
      numero_pregao: "12345",
      numero_chamada_publica: "54321",
      ata: "ATA-001",
    },
    numero_empenho: "213131",
    qtd_total_empenho: 1000.0,
    custo_unitario_produto: 5.5,
    unidade_medida: {
      uuid: "9fec9127-c22f-49c5-b8f4-633039bc6b7f",
      nome: "QUILOGRAMA",
      abreviacao: "kg",
    },
    ficha_tecnica: {
      uuid: "12345678-1234-1234-1234-123456789013",
      produto: {
        uuid: "87654321-4321-4321-4321-210987654321",
        nome: "Arroz",
      },
    },
  },
  programacoes: [
    {
      mes_programado: "03/2026",
      data_inicio: "2026-03-01",
      data_fim: "2026-03-15",
      quantidade: 50.0,
    },
    {
      mes_programado: "04/2026",
      data_inicio: "2026-04-01",
      data_fim: "2026-04-15",
      quantidade: 30.0,
    },
  ],
  logs: [
    {
      status_evento_explicacao: "Cronograma Criado",
      usuario: {
        uuid: "a770efc7-9f07-4ba4-a122-20fec2203c29",
        nome: "SUPER USUARIO CRONOGRAMA",
        email: "cronograma@admin.com",
      },
      criado_em: "06/03/2023 18:33:01",
      justificativa: "",
    },
  ],
};

export const mockCronogramaSemanalDetalheEnviado = {
  ...mockCronogramaSemanalDetalhe,
  uuid: "87654321-4321-4321-4321-210987654321",
  numero: "CSW-002",
  status: "Enviado ao Fornecedor",
  logs: [
    {
      status_evento_explicacao: "Cronograma Criado",
      usuario: {
        uuid: "a770efc7-9f07-4ba4-a122-20fec2203c29",
        nome: "SUPER USUARIO CRONOGRAMA",
        email: "cronograma@admin.com",
      },
      criado_em: "06/03/2023 18:33:01",
      justificativa: "",
    },
    {
      status_evento_explicacao: "Enviado ao Fornecedor",
      usuario: {
        uuid: "a770efc7-9f07-4ba4-a122-20fec2203c29",
        nome: "SUPER USUARIO CRONOGRAMA",
        email: "cronograma@admin.com",
      },
      criado_em: "06/03/2023 18:35:01",
      justificativa: "",
    },
  ],
};
