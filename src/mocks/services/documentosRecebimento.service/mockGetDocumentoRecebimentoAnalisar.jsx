export const mockGetDocumentoRecebimentoAnalisar = {
  uuid: "123",
  fornecedor: "Fornecedor Teste",
  numero_cronograma: "456",
  pregao_chamada_publica: "789",
  nome_produto: "Produto Teste",
  numero_sei: "SEI123",
  numero_laudo: "LAUDO456",
  tipos_de_documentos: [
    {
      tipo_documento: "LAUDO",
      arquivos: [{ nome: "laudo.pdf", uuid: "arquivo123" }],
    },
    {
      tipo_documento: "DECLARACAO_LEI_1512010",
      arquivos: [{ nome: "declaracao.pdf", uuid: "arquivo456" }],
    },
    {
      tipo_documento: "CERTIFICADO_CONF_ORGANICA",
      arquivos: [{ nome: "certificado.pdf", uuid: "arquivo789" }],
    },
    {
      tipo_documento: "RASTREABILIDADE",
      arquivos: [{ nome: "rastreabilidade.pdf", uuid: "arquivo101" }],
    },
  ],
  logs: [
    {
      status_evento_explicacao: "Rascunho",
      data: "2023-01-01",
      usuario: { nome: "Usuário Teste" },
    },
  ],
  laboratorio: { uuid: "lab123", nome: "Laboratório Teste" },
  quantidade_laudo: 100,
  unidade_medida: { uuid: "medida123", nome: "Kg" },
  data_final_lote: "01/01/2023",
  numero_lote_laudo: "LOTE123",
  datas_fabricacao_e_prazos: [
    {
      data_fabricacao: "01/01/2023",
      data_validade: "01/01/2024",
      prazo_maximo_recebimento: "30",
      justificativa: "",
    },
  ],
};
