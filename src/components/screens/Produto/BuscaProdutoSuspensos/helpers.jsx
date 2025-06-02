import moment from "moment";

const dataMin = moment();
const dataMax = moment();
export const DATA_MINIMA = dataMin.subtract(365, "days")["_d"];
export const DATA_MAXIMA = dataMax.add(0, "days")["_d"];

export const DATA_INICIAL = dataMin.format("DD/MM/YYYY");
export const DATA_FINAL = dataMax.add(0, "days").format("DD/MM/YYYY");

export const condicaoDeDatas = (arrayFiltro) => {
  const temDataInicio = arrayFiltro.includes("data_inicial");
  const temDataFim = arrayFiltro.includes("data_final");
  if (temDataFim && temDataInicio) {
    return "range";
  } else if (temDataFim && !temDataInicio) {
    return "ate_data";
  } else if (!temDataFim && temDataInicio) {
    return "de_data";
  } else {
    return "nenhum";
  }
};

export const ehFiltroDeData = (arrayFiltro) => {
  const array1 = ["data_inicial", "data_final"];
  const array2 = ["data_final", "data_inicial"];
  const array3 = ["data_final"];
  const array4 = ["data_inicial"];
  if (
    JSON.stringify(arrayFiltro) === JSON.stringify(array1) ||
    JSON.stringify(arrayFiltro) === JSON.stringify(array2)
  ) {
    return [true, "range"];
  } else if (JSON.stringify(arrayFiltro) === JSON.stringify(array3)) {
    return [true, "ate_data"];
  } else if (JSON.stringify(arrayFiltro) === JSON.stringify(array4)) {
    return [true, "de_data"];
  } else {
    return [false, "nenhum"];
  }
};

export const retornaDataMinima = (valor) => {
  const data = moment(valor, "DD/MM/YYYY");
  return data._d;
};

export const retornaUltimaHomologacao = (item) => {
  const { homologacoes } = item.produto;
  return homologacoes[homologacoes.length - 1];
};

export const retornUltimoLog = (homologacao) => {
  const { logs } = homologacao;
  return logs[logs.length - 1];
};

export const retornaData = (item) => {
  const { criado_em } = item;
  return criado_em.split(" ")[0];
};

export const ultimoLogItem = (item) => {
  const { logs } = item;
  return logs[logs.length - 1];
};
