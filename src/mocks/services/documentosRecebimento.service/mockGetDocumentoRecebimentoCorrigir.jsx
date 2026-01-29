export const mockGetDocumentoRecebimentoCorrigir = {
  uuid: "doc-123",
  fornecedor: "Fornecedor Teste",
  numero_cronograma: "CRON-456",
  pregao_chamada_publica: "PREGAO-789",
  nome_produto: "Produto Teste",
  numero_laudo: "LAUDO-123",
  status: "Enviado para Correção",
  correcao_solicitada:
    "Favor corrigir o documento do laudo conforme especificações técnicas.",
  tipos_de_documentos: [
    {
      tipo_documento: "LAUDO",
      arquivos: [
        {
          nome: "laudo-original.pdf",
          arquivo: "http://example.com/laudo-original.pdf",
        },
      ],
    },
    {
      tipo_documento: "DECLARACAO_LEI_1512010",
      arquivos: [
        {
          nome: "declaracao.pdf",
          arquivo: "http://example.com/declaracao.pdf",
        },
      ],
    },
    {
      tipo_documento: "RASTREABILIDADE",
      arquivos: [
        {
          nome: "rastreabilidade.pdf",
          arquivo: "http://example.com/rastreabilidade.pdf",
        },
      ],
    },
  ],
  logs: [
    {
      status_evento_explicacao: "Rascunho",
      criado_em: "2023-01-14 09:00:00",
      usuario: { nome: "Usuário Fornecedor" },
    },
    {
      status_evento_explicacao: "Enviado para Correção",
      criado_em: "2023-01-15 10:30:00",
      usuario: { nome: "Usuário CODAE" },
    },
  ],
  programa_leve_leite: false,
};
