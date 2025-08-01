import moment from "moment";
import { IFiltros } from "../../types";

/**
 * Extrai o mês e o ano de uma string no formato "MM_YYYY".
 *
 * @param {string} values_mes - String no formato "MM_YYYY" (ex: "05_2025").
 * @returns {{ mes: number, ano: number }} Objeto com mês e ano como números.
 * @throws {Error} Se o parâmetro não for informado.
 */
export const getMesAno = (
  values_mes?: string
): { mes: number; ano: number } => {
  if (!values_mes) {
    throw new Error("Parâmetro 'values_mes' é obrigatório.");
  }
  const [mes, ano] = values_mes.split("_").map(Number);
  return { mes, ano };
};

/**
 * Retorna a validação para a data inicial com base no mês/ano selecionado.
 *
 * @param {IFiltros} values - Objeto contendo o filtro com o campo `mes` e `periodo_lancamento_de`.
 * @param {string} [campo] - Se definido, ignora o valor do período e retorna o 1º dia do mês.
 * @returns {Date | null} A data inicial para validação ou `null` se `mes` não for informado.
 */
export const validateDataInicial = (
  values: IFiltros,
  campo?: string
): null | Date => {
  if (!values.mes) return null;

  const { mes, ano } = getMesAno(values.mes);
  const primeiroDia = new Date(ano, mes - 1, 1);

  if (campo) return primeiroDia;

  return values.periodo_lancamento_de
    ? moment(values.periodo_lancamento_de, "DD/MM/YYYY").toDate()
    : primeiroDia;
};

/**
 * Retorna a validação da data final com base no mês/ano selecionado.
 *
 * @param {IFiltros} values - Objeto contendo o filtro com o campo `mes` e `periodo_lancamento_ate`.
 * @param {string} [campo] - Se definido, ignora o valor do período e retorna o último dia do mês.
 * @returns {Date | null} A data final para validação ou `null` se `mes` não for informado.
 */
export const validateDataFinal = (
  values: IFiltros,
  campo?: string
): null | Date => {
  if (!values.mes) return null;

  const { mes, ano } = getMesAno(values.mes);
  const ultimoDia = new Date(ano, mes, 0);

  if (campo) return ultimoDia;

  return values.periodo_lancamento_ate
    ? moment(values.periodo_lancamento_ate, "DD/MM/YYYY").toDate()
    : ultimoDia;
};
