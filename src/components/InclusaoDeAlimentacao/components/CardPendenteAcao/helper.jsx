export const getDataMaisProxima = (solicitacao) => {
  const dataMaisProxima = solicitacao.inclusoes
    ? solicitacao.inclusoes[0].data
    : solicitacao.dias_motivos_da_inclusao_cei
      ? solicitacao.dias_motivos_da_inclusao_cei[0].data
      : solicitacao.dias_motivos_da_inclusao_cemei
        ? solicitacao.dias_motivos_da_inclusao_cemei[0].data
        : solicitacao.data;
  return dataMaisProxima;
};
