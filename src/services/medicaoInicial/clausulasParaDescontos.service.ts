import {
  ClausulaInterface,
  ClausulaPayload,
  FiltrosInterface,
  ResponseClausulasInterface,
} from "src/interfaces/clausulas_para_descontos.interface";
import axios from "../_base";
import { ErrorHandlerFunction } from "../service-helpers";

export const cadastraClausulaParaDesconto = async (
  payload: ClausulaPayload
) => {
  return await axios.post("/medicao-inicial/clausulas-de-descontos/", payload);
};

export const getClausulasParaDescontos = async (
  page: number,
  filtros: FiltrosInterface
) => {
  let url = "/medicao-inicial/clausulas-de-descontos/";
  const params = { page, ...filtros };

  return await axios.get<ResponseClausulasInterface>(url, { params });
};

export const getClausulaParaDesconto = async (uuid: string) => {
  const url = `/medicao-inicial/clausulas-de-descontos/${uuid}/`;
  const response = await axios
    .get<ClausulaInterface>(url)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const editaClausulaParaDesconto = async (
  uuid: string,
  payload: Partial<ClausulaPayload>
) => {
  return await axios.patch(
    `/medicao-inicial/clausulas-de-descontos/${uuid}/`,
    payload
  );
};

export const deletaClausulaParaDesconto = async (uuid: string) => {
  return await axios.delete(`/medicao-inicial/clausulas-de-descontos/${uuid}/`);
};
