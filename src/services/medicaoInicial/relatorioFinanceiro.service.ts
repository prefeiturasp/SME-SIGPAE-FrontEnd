import {
  DadosLiquidacaoEmpenho,
  DadosLiquidacaoResponse,
  FiltrosInterface,
  RelatorioFinanceiroConsolidado,
  PayloadRelatorioFinanceiro,
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

export const editarRelatorioFinanceiro = async (
  uuid: string,
  payload: Partial<PayloadRelatorioFinanceiro>,
) => {
  const response = await axios
    .patch<RelatorioFinanceiroResponse>(
      `/medicao-inicial/relatorio-financeiro/${uuid}/`,
      payload,
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
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
  relatorioFinanceiro: string,
) => {
  const response = await axios
    .put(
      `/medicao-inicial/dados-liquidacao/registrar-empenhos/${relatorioFinanceiro}/`,
      payload,
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const exportarPDFAsyncRelatorioAtesteFinanceiro = async (
  relatorioFinanceiro: string,
) => {
  const url = `/medicao-inicial/relatorio-financeiro/exportar-pdf/${relatorioFinanceiro}/`;
  const response = await axios.post(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
