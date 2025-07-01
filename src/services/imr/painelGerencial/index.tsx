import axios from "../../_base";
import { API_URL } from "src/constants/config";
import { ErrorHandlerFunction } from "../../service-helpers";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { FiltrosRelatoriosVisitasInterface } from "src/interfaces/imr.interface";
import {
  ResponseNomesNutricionistas,
  ResponseRelatoriosVisitas,
} from "src/interfaces/responses.interface";

export const getDashboardPainelGerencialSupervisao = async (
  params: FiltrosRelatoriosVisitasInterface
) => {
  const url = `${API_URL}/imr/formulario-supervisao/dashboard/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getListRelatoriosVisitaSupervisao = async (
  params: URLSearchParams
): Promise<ResponseRelatoriosVisitas> => {
  try {
    return await axios.get("/imr/formulario-supervisao/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getListNomesNutricionistas =
  async (): Promise<ResponseNomesNutricionistas> => {
    const url = "/imr/formulario-supervisao/lista_nomes_nutricionistas/";
    try {
      return await axios.get(url);
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };
