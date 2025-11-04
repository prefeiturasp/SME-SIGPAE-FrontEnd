import axios from "../_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const getDashboardMedicaoInicialTotalizadores = async (
  params = null,
) => {
  const url = `medicao-inicial/solicitacao-medicao-inicial/dashboard-totalizadores/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDashboardMedicaoInicialResultados = async (params = null) => {
  const url = `medicao-inicial/solicitacao-medicao-inicial/dashboard-resultados/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getMesesAnosSolicitacoesMedicaoinicial = async (params = {}) => {
  const url = `medicao-inicial/solicitacao-medicao-inicial/meses-anos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
