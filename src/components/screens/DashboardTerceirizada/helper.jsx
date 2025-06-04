import {
  parseDataHoraBrToMoment,
  comparaObjetosMoment,
} from "src/helpers/utilities";

export const filtraPrioritarios = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.solicitacao_kit_lanche.prioridade === "PRIORITARIO";
  });
};

export const filtraNoLimite = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.solicitacao_kit_lanche.prioridade === "LIMITE";
  });
};

export const filtraRegular = (pedidos) => {
  return pedidos.filter((pedido) => {
    return pedido.solicitacao_kit_lanche.prioridade === "REGULAR";
  });
};

export const filtrarTotalSolicitacoes = (pedidos) => {
  return pedidos.length;
};

export const ordenaPorDate = (a, b) => {
  const data_a = parseDataHoraBrToMoment(a.date);
  const data_b = parseDataHoraBrToMoment(b.date);
  return comparaObjetosMoment(data_b, data_a);
};

export const extrairStatusDaSolicitacaoURL = (urlParaSeparar) => {
  let arrayDeStrings = urlParaSeparar.split("/");
  return arrayDeStrings[arrayDeStrings.length - 1];
};
