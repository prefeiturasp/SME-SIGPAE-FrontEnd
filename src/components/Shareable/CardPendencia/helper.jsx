export const retornaTituloCardPendencias = (solicitacao) => {
  if (solicitacao === undefined) {
    return "Solicitações";
  }
  if (solicitacao === 1) {
    return "Solicitação";
  } else {
    return "Solicitações";
  }
};
