import axios from "../_base";
const BASE_URL = "medicao-inicial/parametrizacao-financeira";
export default class ParametrizacaoFinanceiraService {
  static async addParametrizacaoFinanceira(payload) {
    await axios.post(`${BASE_URL}/`, payload);
  }
  static async getParametrizacoesFinanceiras(page, filtros) {
    const params = { page, ...filtros };
    const response = await axios.get(`${BASE_URL}/`, { params });
    return response.data;
  }
  static async getParametrizacaoFinanceira(uuid) {
    const response = await axios.get(`${BASE_URL}/${uuid}/`);
    return response.data;
  }
  static async editParametrizacaoFinanceira(uuid, payload) {
    await axios.patch(`${BASE_URL}/${uuid}/`, payload);
  }
}
