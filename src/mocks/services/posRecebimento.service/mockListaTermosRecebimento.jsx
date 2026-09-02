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

export const mockListaTermosRecebimentoFornecedor = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: "uuid-1",
      numero_contrato: "25/SME/CODAE/2025",
      nome_empresa: "Fornecedor Alimentos",
      produtos: ["BISCOITO DE POLVILHO DOCE", "BISCOITO DE POLVILHO SALGADO"],
      data_cadastro: "18/12/2025",
      status: "ENVIADO_FISCAIS",
      status_display: "Enviado Fiscais",
    },
    {
      uuid: "uuid-2",
      numero_contrato: "15/SME/CODAE/2025",
      nome_empresa: "Fornecedor Alimentos",
      produtos: ["LEITE EM PÓ INTEGRAL"],
      data_cadastro: "16/12/2025",
      status: "ASSINADO_FORNECEDOR",
      status_display: "Assinado Fornecedor",
    },
  ],
};
