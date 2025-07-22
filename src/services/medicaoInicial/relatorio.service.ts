import axios from "../_base";
import { ErrorHandlerFunction } from "../service-helpers";

import {
  RelatorioAdesaoExportResponse,
  RelatorioAdesaoParams,
  RelatorioAdesaoResponse,
} from "./relatorio.interface";

const BASE_URL = "medicao-inicial/relatorios";

export default class RelatorioService {
  static async getRelatorioAdesao(
    params: RelatorioAdesaoParams
  ): Promise<RelatorioAdesaoResponse> {
    const response = await axios
      .get(`${BASE_URL}/relatorio-adesao/`, {
        params,
      })
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  }

  static async exportarRelatorioAdesaoParaXLSX(
    params: RelatorioAdesaoParams
  ): Promise<RelatorioAdesaoExportResponse> {
    const response = await axios
      .get(`${BASE_URL}/relatorio-adesao/exportar-xlsx/`, {
        params,
      })
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  }

  static async exportarRelatorioAdesaoParaPDF(
    params: RelatorioAdesaoParams
  ): Promise<RelatorioAdesaoExportResponse> {
    const response = await axios
      .get(`${BASE_URL}/relatorio-adesao/exportar-pdf/`, {
        params,
      })
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  }
}
