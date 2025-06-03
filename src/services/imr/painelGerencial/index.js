import axios from "../../_base";
import { API_URL } from "src/constants/config";
import { ErrorHandlerFunction } from "../../service-helpers";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
export const getDashboardPainelGerencialSupervisao = async (params) => {
  const url = `${API_URL}/imr/formulario-supervisao/dashboard/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getListRelatoriosVisitaSupervisao = async (params) => {
  try {
    return await axios.get("/imr/formulario-supervisao/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListNomesNutricionistas = async () => {
  const url = "/imr/formulario-supervisao/lista_nomes_nutricionistas/";
  try {
    return await axios.get(url);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
