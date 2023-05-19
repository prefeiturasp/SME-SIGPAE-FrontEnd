import { usuarioEhEmpresaFornecedor } from "helpers/utilities";

export const montarOptionsStatus = () => {
  return usuarioEhEmpresaFornecedor()
    ? options_status_fornecedor
    : options_status;
};

export const options_status = [
  {
    value: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    label: "Assinado e Enviado ao Fornecedor"
  },
  {
    value: "ASSINADO_FORNECEDOR",
    label: "Assinado Fornecedor"
  },
  {
    value: "ASSINADO_DINUTRE",
    label: "Assinado DINUTRE"
  },
  {
    value: "ASSINADO_CODAE",
    label: "Assinado CODAE"
  }
];

export const options_status_fornecedor = [
  {
    value: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    label: "Recebido"
  },
  {
    value: ["ASSINADO_FORNECEDOR", "ASSINADO_DINUTRE"],
    label: "Aguardando CODAE"
  },
  {
    value: "ASSINADO_CODAE",
    label: "Assinado CODAE"
  }
];

export const deParaStatusCronograma = status =>
  ["Assinado Fornecedor", "Assinado Dinutre"].includes(status) &&
  usuarioEhEmpresaFornecedor()
    ? "Aguardando CODAE"
    : status;
