export const existeLogDeCancelamentoDaEscola = (solicitacao) => {
  let ehCancelamento = false;
  solicitacao.logs.forEach((log) => {
    if (log.status_evento_explicacao === "Escola cancelou") {
      ehCancelamento = true;
    } else if (log.status_evento_explicacao === "DRE cancelou") {
      ehCancelamento = true;
    }
  });
  return ehCancelamento;
};
