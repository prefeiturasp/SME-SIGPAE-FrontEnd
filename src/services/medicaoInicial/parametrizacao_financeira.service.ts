import axios from "../_base";

import {
  ParametrizacaoFinanceiraPayload,
  ParametrizacaoFinanceiraParams,
  ParametrizacaoFinanceiraResponse,
  ParametrizacaoFinanceiraInterface,
} from "./parametrizacao_financeira.interface";

const BASE_URL = "medicao-inicial/parametrizacao-financeira";

export default class ParametrizacaoFinanceiraService {
  static async addParametrizacaoFinanceira(
    payload: ParametrizacaoFinanceiraPayload,
  ): Promise<void> {
    await axios.post(`${BASE_URL}/`, payload);
  }

  static async getParametrizacoesFinanceiras(
    page: number,
    filtros: ParametrizacaoFinanceiraParams,
  ): Promise<ParametrizacaoFinanceiraResponse> {
    const params = { page, ...filtros };

    const response = await axios.get(`${BASE_URL}/`, { params });
    return response.data;
  }

  static async getDadosParametrizacaoFinanceira(
    uuid: string,
  ): Promise<ParametrizacaoFinanceiraInterface> {
    const response = await axios.get(
      `${BASE_URL}/dados-parametrizacao-financeira/${uuid}/`,
    );
    return response.data;
  }

  static async editParametrizacaoFinanceira(
    uuid: string,
    payload: Partial<ParametrizacaoFinanceiraPayload>,
  ): Promise<void> {
    await axios.patch(`${BASE_URL}/${uuid}/`, payload);
  }

  static async cloneParametrizacaoFinanceira(
    uuid: string,
    payload: ParametrizacaoFinanceiraPayload,
  ): Promise<ParametrizacaoFinanceiraInterface> {
    const response = await axios.post(`${BASE_URL}/clonar/${uuid}/`, payload);
    return response.data;
  }

  static async deleteParametrizacaoFinanceira(uuid: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${uuid}/`);
  }
}
