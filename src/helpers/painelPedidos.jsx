import { deepCopy } from "./utilities";

export const formatarPedidos = (pedidos) => {
  return pedidos.map((pedido) => {
    let novoPedido = pedido;
    novoPedido["checked"] = false;
    return novoPedido;
  });
};

export const filtraPrioritarios = (pedidos, filtro = null) => {
  return pedidos.filter((pedido) => {
    const prioridade = filtro
      ? pedido[filtro]["prioridade"]
      : pedido["prioridade"];

    return prioridade === "PRIORITARIO";
  });
};

export const filtraNoLimite = (pedidos, filtro = null) => {
  return pedidos.filter((pedido) => {
    const prioridade = filtro
      ? pedido[filtro]["prioridade"]
      : pedido["prioridade"];

    return prioridade === "LIMITE";
  });
};
export const filtraRegular = (pedidos, filtro = null) => {
  return pedidos.filter((pedido) => {
    const prioridade = filtro
      ? pedido[filtro]["prioridade"]
      : pedido["prioridade"];

    return prioridade === "REGULAR";
  });
};

export const ordenarPedidosDataMaisRecente = (pedidos) => {
  const pedidosFiltradosCopy = deepCopy(pedidos).map((obj) => {
    const dataMaisProxima = obj.inclusoes
      ? obj.inclusoes[0].data
      : obj.dias_motivos_da_inclusao_cemei
      ? obj.dias_motivos_da_inclusao_cemei[0].data
      : obj.dias_motivos_da_inclusao_cei
      ? obj.dias_motivos_da_inclusao_cei[0].data
      : obj.solicitacao_kit_lanche
      ? obj.solicitacao_kit_lanche.data
      : obj.data;
    const arrayData = (
      obj.data_inicial ||
      obj.alterar_dia ||
      dataMaisProxima
    ).split("/");
    return {
      ...obj,
      date: new Date(arrayData[2], arrayData[1] - 1, arrayData[0]),
    };
  });

  const pedidosOrdenados = pedidosFiltradosCopy.sort(
    (objA, objB) => Number(objA.date) - Number(objB.date)
  );

  return pedidosOrdenados;
};

// de informativo
export const filtraCiencia = (informacoes) => {
  return informacoes.filter((pedido) => {
    return pedido.status === "TERCEIRIZADA_TOMA_CIENCIA";
  });
};

export const filtraInformados = (informacoes) => {
  return informacoes.filter((pedido) => {
    return pedido.status === "INFORMADO";
  });
};

export const obtemDataSolicitacao = (solicitacao) => {
  return solicitacao.logs[1].criado_em;
};
