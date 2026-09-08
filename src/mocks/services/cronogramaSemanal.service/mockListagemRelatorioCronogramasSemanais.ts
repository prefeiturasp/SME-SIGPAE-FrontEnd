export const mockListagemRelatorioCronogramasSemanais = {
  count: 2,
  results: [
    {
      numero: "001/2025",
      empresa: "Empresa Alfa Alimentos LTDA",
      // Produto com mais de 30 caracteres para validar o truncamento.
      produto: "Arroz Parboilizado Tipo 1 Longo Fino",
      qtd_total_empenho: 1500,
      unidade_medida: "KG",
      status: "Assinado Fornecedor",
      custo_unitario_produto: 12.5,
      programacoes: [
        {
          quantidade: 500,
          data_inicio: "01/01/2025",
          data_fim: "07/01/2025",
          mes_programado: "Janeiro",
        },
        {
          quantidade: 1000,
          data_inicio: "08/01/2025",
          data_fim: "14/01/2025",
          mes_programado: "Janeiro",
        },
      ],
    },
    {
      // Mesmo número do primeiro para validar que expandir uma linha não
      // expande outra com o mesmo número de cronograma.
      numero: "001/2025",
      empresa: "Empresa Beta Comercio LTDA",
      produto: "Feijão Carioca",
      qtd_total_empenho: 800,
      unidade_medida: "KG",
      status: "Enviado ao Fornecedor",
      custo_unitario_produto: 9,
      programacoes: [
        {
          quantidade: 800,
          data_inicio: "02/02/2025",
          data_fim: "09/02/2025",
          mes_programado: "Fevereiro",
        },
      ],
    },
  ],
};

export const mockListagemRelatorioCronogramasSemanaisVazia = {
  count: 0,
  results: [],
};
