import axios from "../_base";
const BASE_URL = "medicao-inicial/relatorios";
export default class RelatorioService {
  static async getRelatorioAdesao(params) {
    const response = await axios.get(`${BASE_URL}/relatorio-adesao/`, {
      params,
    });
    return response.data;
  }
  static async exportarRelatorioAdesaoParaXLSX(params) {
    const response = await axios.get(
      `${BASE_URL}/relatorio-adesao/exportar-xlsx/`,
      {
        params,
      }
    );
    return response.data;
  }
  static async exportarRelatorioAdesaoParaPDF(params) {
    const response = await axios.get(
      `${BASE_URL}/relatorio-adesao/exportar-pdf/`,
      {
        params,
      }
    );
    return response.data;
  }
}
