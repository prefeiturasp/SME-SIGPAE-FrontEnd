import moment from "moment";

import { stringDecimalToNumber } from "helpers/parsers";

export const prepararPayloadCronograma = (
  cronograma,
  values,
  etapas,
  recebimentos
) => {
  let etapasPayload = prepararPayloadEtapas(values, etapas);
  let recebimentosPayload = prepararPayloadRecebimentos(values, recebimentos);
  return {
    cronograma: cronograma.uuid,
    qtd_total_programada: values.quantidade_total
      ?.replaceAll(".", "")
      .replace(",", "."),
    etapas: etapasPayload,
    programacoes_de_recebimento: recebimentosPayload,
    justificativa: values.justificativa,
  };
};

export const prepararPayloadAnaliseCronograma = (
  justificativa,
  values,
  etapas,
  recebimentos
) => {
  let etapasPayload = prepararPayloadEtapas(values, etapas);
  let recebimentosPayload = prepararPayloadRecebimentos(values, recebimentos);
  return {
    programacoes_de_recebimento: recebimentosPayload,
    etapas: etapasPayload,
    justificativa_cronograma: justificativa["justificativa_cronograma"],
  };
};

export const prepararPayloadEtapas = (values, etapas) => {
  let etapasPayload = [];

  etapasPayload = etapas.map((etapa, index) => ({
    numero_empenho: values[`empenho_${index}`],
    etapa: values[`etapa_${index}`],
    parte: values[`parte_${index}`],
    data_programada: values[`data_programada_${index}`]
      ? moment(values[`data_programada_${index}`], "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        )
      : undefined,
    quantidade: values[`quantidade_${index}`].replaceAll(".", ""),
    total_embalagens: stringDecimalToNumber(
      values[`total_embalagens_${index}`]
    ),
    qtd_total_empenho: stringDecimalToNumber(
      values[`qtd_total_empenho_${index}`]
    ),
  }));

  return etapasPayload;
};

export const prepararPayloadRecebimentos = (values, recebimentos) => {
  let recebimentosPayload = [];

  recebimentosPayload = recebimentos.map((etapa, index) => ({
    data_programada: values[`data_recebimento_${index}`],
    tipo_carga: values[`tipo_recebimento_${index}`],
  }));

  return recebimentosPayload;
};

export const calculaRestante = (values, cronograma) => {
  let resto = cronograma.qtd_total_programada;
  cronograma.etapas.forEach((etapa) => {
    if (values[`quantidade_total_${etapa.uuid}`])
      resto -= values[`quantidade_total_${etapa.uuid}`];
  });
  return resto;
};
