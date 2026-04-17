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
];

export const options_status_fornecedor = [
  {
    value: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    label: "Recebido",
  },
];

export const deParaStatusCronograma = (status) =>
  ["Assinado Fornecedor", "Assinado Abastecimento"].includes(status) &&
  usuarioEhEmpresaFornecedor()
    ? "Aguardando CODAE"
    : status;
