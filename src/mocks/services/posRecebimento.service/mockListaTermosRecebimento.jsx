export const mockListaTermosRecebimento = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: "uuid-1",
      numero_contrato: "123/2025",
      nome_empresa: "Empresa Alfa",
      data_cadastro: "01/08/2025",
      status: "RASCUNHO",
      status_display: "Rascunho",
    },
    {
      uuid: "uuid-2",
      numero_contrato: "456/2025",
      nome_empresa: "Empresa Beta",
      data_cadastro: "02/08/2025",
      status: "ENVIADO_FISCAIS",
      status_display: "Enviado Fiscais",
    },
  ],
};

export const mockListaTermosRecebimentoVazia = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
