import { IFiltros } from "../../types";

const getMesAno = (values_mes?: string): { mes: number; ano: number } => {
  if (!values_mes) {
    throw new Error("Parâmetro 'values_mes' é obrigatório.");
  }
  const [mes, ano] = values_mes.split("_").map(Number);
  return { mes, ano };
};

export const validateDataInicial = (values: IFiltros) => {
  const { mes, ano } = getMesAno(values.mes);
  const primeiroDia = new Date(ano, mes - 1, 1);
  return primeiroDia;
};

export const validateDataFinal = (values: IFiltros) => {
  const { mes, ano } = getMesAno(values.mes);
  const ultimoDia = new Date(ano, mes, 0);
  return ultimoDia;
};
