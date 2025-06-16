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
    value: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    label: "Assinado e Enviado ao Fornecedor",
  },
  {
    value: "ASSINADO_FORNECEDOR",
    label: "Assinado Fornecedor",
  },
  {
    value: "ASSINADO_DILOG_ABASTECIMENTO",
    label: "Assinado Abastecimento",
  },
  {
    value: "ASSINADO_CODAE",
    label: "Assinado CODAE",
  },
  {
    value: "ALTERACAO_CODAE",
    label: "Alteração CODAE",
  },
  {
    value: "SOLICITADO_ALTERACAO",
    label: "Solicitado Alteração",
  },
];

export const options_status_fornecedor = [
  {
    value: "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    label: "Recebido",
  },
  {
    value: ["ASSINADO_FORNECEDOR", "ASSINADO_DILOG_ABASTECIMENTO"],
    label: "Aguardando CODAE",
  },
  {
    value: "ASSINADO_CODAE",
    label: "Assinado CODAE",
  },
  {
    value: "ALTERACAO_CODAE",
    label: "Alteração CODAE",
  },
  {
    value: "SOLICITADO_ALTERACAO",
    label: "Solicitado Alteração",
  },
];

export const deParaStatusCronograma = (status) =>
  ["Assinado Fornecedor", "Assinado Abastecimento"].includes(status) &&
  usuarioEhEmpresaFornecedor()
    ? "Aguardando CODAE"
    : status;
