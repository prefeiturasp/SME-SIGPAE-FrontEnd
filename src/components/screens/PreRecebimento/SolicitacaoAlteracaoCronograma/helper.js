import { usuarioEhEmpresaFornecedor } from "helpers/utilities";

export const montarMenuOptionStatus = () => {
  return usuarioEhEmpresaFornecedor()
    ? option_status_fornecedor
    : option_status;
};

export const option_status = [
  {
    value: "EM_ANALISE",
    label: "Em Análise"
  },
  {
    value: "CRONOGRAMA_CIENTE",
    label: "Cronograma Ciente"
  },
  {
    value: "APROVADO_DINUTRE",
    label: "Aprovado DINUTRE"
  },
  {
    value: "REPROVADO_DINUTRE",
    label: "Reprovado DINUTRE"
  },
  {
    value: "APROVADO_DILOG",
    label: "Aprovado DILOG"
  },
  {
    value: "REPROVADO_DILOG",
    label: "Reprovado DILOG"
  }
];

export const option_status_fornecedor = [
  {
    value: [
      "EM_ANALISE",
      "CRONOGRAMA_CIENTE",
      "APROVADO_DINUTRE",
      "REPROVADO_DINUTRE"
    ],
    label: "Em Análise"
  },
  {
    value: "APROVADO_DILOG",
    label: "Aprovado DILOG"
  },
  {
    value: "REPROVADO_DILOG",
    label: "Reprovado DILOG"
  }
];

export const remove_filtros_nulos = filtros => {
  if (filtros["data_after"] === null) {
    delete filtros["data_after"];
  }
  if (filtros["data_before"] === null) {
    delete filtros["data_before"];
  }

  return filtros;
};
