import {
  FiltrosInterface,
  RelatorioFinanceiroConsolidado,
  RelatorioFinanceiroResponse,
} from "src/interfaces/relatorio_financeiro.interface";
import axios from "../_base";

export const getRelatoriosFinanceiros = async (
  page: number,
  filtros: FiltrosInterface
) => {
  let url = "/medicao-inicial/relatorio-financeiro/";
  const params = { page, ...filtros };

  return await axios.get<RelatorioFinanceiroResponse>(url, { params });
};

export const getRelatorioFinanceiroConsolidado = async (uuid: string) => {
  return await axios.get<RelatorioFinanceiroConsolidado>(
    `/medicao-inicial/relatorio-financeiro/relatorio-consolidado/${uuid}/`
  );
};
