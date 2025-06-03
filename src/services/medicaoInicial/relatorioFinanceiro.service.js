import axios from "../_base";
export const getRelatoriosFinanceiros = async (page, filtros) => {
  let url = "/medicao-inicial/relatorio-financeiro/";
  const params = { page, ...filtros };
  return await axios.get(url, { params });
};
export const getRelatorioFinanceiroConsolidado = async (uuid) => {
  return await axios.get(
    `/medicao-inicial/relatorio-financeiro/relatorio-consolidado/${uuid}/`
  );
};
