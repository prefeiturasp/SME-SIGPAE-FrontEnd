export const getStatus = () => {
  return [
    { label: "Autorizada", value: "CODAE_AUTORIZADO" },
    { label: "Negada", value: "CODAE_NEGOU_PEDIDO" },
    { label: "Pendente", value: "CODAE_A_AUTORIZAR" },
    { label: "Cancelada", value: "ESCOLA_CANCELOU" },
  ];
};
