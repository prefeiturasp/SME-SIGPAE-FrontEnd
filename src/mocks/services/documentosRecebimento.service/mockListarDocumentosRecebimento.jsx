export const mockListarDocumentosRecebimento = {
  count: 2,
  results: [
    {
      uuid: "3f8a1c9e-2d47-4b6a-9e15-7c0b8d4a2f31",
      numero_cronograma: "001/2024",
      numero_laudo: "LAUDO-001",
      pregao_chamada_publica: "PREGAO-001",
      nome_produto: "Arroz Parboilizado Tipo 1 Longo Fino",
      criado_em: "01/01/2024",
      status: "Aprovado",
      programa_leve_leite: true,
    },
    {
      uuid: "b6d290f4-8a13-4c7e-bf52-1e9a6c3d80a7",
      numero_cronograma: "002/2024",
      numero_laudo: "LAUDO-002",
      pregao_chamada_publica: "PREGAO-002",
      nome_produto: "Feijão Carioca",
      criado_em: "02/01/2024",
      status: "Enviado para Correção",
      programa_leve_leite: false,
    },
  ],
};

export const mockListarDocumentosRecebimentoVazio = {
  count: 0,
  results: [],
};
