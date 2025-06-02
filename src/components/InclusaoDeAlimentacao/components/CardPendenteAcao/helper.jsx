export const calcularNumeroDeEscolasUnicas = (pedidos) => {
  let escolasDiferentes = [];
  pedidos.forEach((pedido) => {
    if (!escolasDiferentes.includes(pedido.escola.uuid))
      escolasDiferentes.push(pedido.escola.uuid);
  });
  return escolasDiferentes.length;
};

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
