import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";

export const montarOptionsStatus = () => {
  return usuarioEhEmpresaFornecedor()
    ? options_status_fornecedor
    : options_status;
};

export const options_status = [
  {
    value: "RASCUNHO",
    label: "Rascunho",
  },
  {
    value: "ENVIADO_AO_FORNECEDOR",
    label: "Enviado ao Fornecedor",
  },
  {
    value: "FORNECEDOR_CIENTE",
    label: "Fornecedor Ciente",
  },
];

export const options_status_fornecedor = [
  {
    value: "ENVIADO_AO_FORNECEDOR",
    label: "Recebido",
  },
  {
    value: "FORNECEDOR_CIENTE",
    label: "Fornecedor Ciente",
  },
];
