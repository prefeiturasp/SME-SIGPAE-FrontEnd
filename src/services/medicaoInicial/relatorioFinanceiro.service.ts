import {
  DadosLiquidacaoEmpenho,
  DadosLiquidacaoResponse,
  FiltrosInterface,
  RelatorioFinanceiroConsolidado,
  RelatorioFinanceiroResponse,
} from "src/interfaces/relatorio_financeiro.interface";
import axios from "../_base";
import { ErrorHandlerFunction } from "../service-helpers";

export const getRelatoriosFinanceiros = async (
  page: number,
  filtros: FiltrosInterface,
) => {
  let url = "/medicao-inicial/relatorio-financeiro/";
  const params = { page, ...filtros };

  return await axios.get<RelatorioFinanceiroResponse>(url, { params });
};

export const getRelatorioFinanceiroConsolidado = async (uuid: string) => {
  return await axios.get<RelatorioFinanceiroConsolidado>(
    `/medicao-inicial/relatorio-financeiro/relatorio-consolidado/${uuid}/`,
  );
};

export const getRelatorioDadosLiquidacao = async (params) => {
  return await axios.get<DadosLiquidacaoResponse>(
    "/medicao-inicial/dados-liquidacao/",
    {
      params: params,
    },
  );
};

export const cadastroDadosEmpenho = async (
  payload: Partial<DadosLiquidacaoEmpenho[]>,
) => {
  const response = await axios
    .post("/medicao-inicial/dados-liquidacao/", payload)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
