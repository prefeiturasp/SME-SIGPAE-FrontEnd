export const mockListarQuestoesPorProduto = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: "87471120-b48a-4ad7-a998-36f23087a855",
      numero_ficha: "FT011",
      nome_produto: "CAQUI",
      questoes_primarias: ["IDENTIFICAÇÃO DO PRODUTO"],
      questoes_secundarias: ["DATA DE VALIDADE"],
    },
    {
      uuid: "7dce74e9-e949-4643-9bba-3a75c492fd81",
      numero_ficha: "FT012",
      nome_produto: "CAQUI",
      questoes_primarias: ["IDENTIFICAÇÃO DO PRODUTO", "DATA DE VALIDADE"],
      questoes_secundarias: ["PESO LÍQUIDO (EXCETO SUCO)"],
    },
  ],
};

export const mockListarQuestoesPorProduto2 = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      uuid: "87471120-b48a-4ad7-a998-36f23087a855",
      numero_ficha: "FT011",
      nome_produto: "CAQUI",
      questoes_primarias: ["IDENTIFICAÇÃO DO PRODUTO"],
      questoes_secundarias: ["DATA DE VALIDADE"],
    },
  ],
};
