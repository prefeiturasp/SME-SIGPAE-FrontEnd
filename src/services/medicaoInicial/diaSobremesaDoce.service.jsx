import axios from "../_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const getDiasSobremesaDoce = async (params = null) => {
  const url = `medicao-inicial/dias-sobremesa-doce/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const setDiaSobremesaDoce = async (payload) => {
  const url = `medicao-inicial/dias-sobremesa-doce/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteDiaSobremesaDoce = async (uuid) => {
  const url = `medicao-inicial/dias-sobremesa-doce/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getListaDiasSobremesaDoce = async (params = null) => {
  const url = `medicao-inicial/dias-sobremesa-doce/lista-dias/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
