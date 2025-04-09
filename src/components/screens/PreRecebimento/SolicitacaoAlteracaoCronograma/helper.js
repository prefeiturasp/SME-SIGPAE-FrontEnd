import { usuarioEhEmpresaFornecedor } from "helpers/utilities";

export const montarMenuOptionStatus = () => {
  return usuarioEhEmpresaFornecedor()
    ? option_status_fornecedor
    : option_status;
};

export const option_status = [
  {
    value: "EM_ANALISE",
    label: "Em Análise",
  },
  {
    value: "CRONOGRAMA_CIENTE",
    label: "Cronograma Ciente",
  },
  {
    value: "APROVADO_DILOG_ABASTECIMENTO",
    label: "Aprovado Abastecimento",
  },
  {
    value: "REPROVADO_DILOG_ABASTECIMENTO",
    label: "Reprovado Abastecimento",
  },
  {
    value: "APROVADO_DILOG",
    label: "Aprovado DILOG",
  },
  {
    value: "REPROVADO_DILOG",
    label: "Reprovado DILOG",
  },
  {
    value: "ALTERACAO_ENVIADA_FORNECEDOR",
    label: "Alteração Enviada ao Fornecedor",
  },
  {
    value: "FORNECEDOR_CIENTE",
    label: "Fornecedor Ciente",
  },
];

export const option_status_fornecedor = [
  {
    value: [
      "EM_ANALISE",
      "CRONOGRAMA_CIENTE",
      "APROVADO_DILOG_ABASTECIMENTO",
      "REPROVADO_DILOG_ABASTECIMENTO",
    ],
    label: "Em Análise",
  },
  {
    value: "APROVADO_DILOG",
    label: "Aprovado DILOG",
  },
  {
    value: "REPROVADO_DILOG",
    label: "Reprovado DILOG",
  },
  {
    value: "ALTERACAO_ENVIADA_FORNECEDOR",
    label: "Recebida Alteração da CODAE",
  },
  {
    value: "FORNECEDOR_CIENTE",
    label: "Fornecedor Ciente",
  },
];

export const remove_filtros_nulos = (filtros) => {
  if (filtros["data_after"] === null) {
    delete filtros["data_after"];
  }
  if (filtros["data_before"] === null) {
    delete filtros["data_before"];
  }

  return filtros;
};
