import {
  ResponseContratosVigentesInterface,
  EmpenhoInterface,
  FiltrosInterface,
  ResponseEmpenhosInterface,
  EmpenhoPayload,
} from "src/interfaces/empenhos.interface";
import axios from "../_base";

export const getContratosVigentes = async () => {
  return await axios.get<ResponseContratosVigentesInterface>(
    "/vigencias/contratos-vigentes/"
  );
};

export const cadastraEmpenho = async (payload: EmpenhoInterface) => {
  return await axios.post("/medicao-inicial/empenhos/", payload);
};

export const getEmpenhos = async (page: number, filtros: FiltrosInterface) => {
  let url = "/medicao-inicial/empenhos/";
  const params = { page, ...filtros };

  return await axios.get<ResponseEmpenhosInterface>(url, { params });
};

export const getEmpenho = async (uuid: string) => {
  return await axios.get<EmpenhoInterface>(
    `/medicao-inicial/empenhos/${uuid}/`
  );
};

export const editaEmpenho = async (uuid: string, payload: EmpenhoPayload) => {
  return await axios.patch(`/medicao-inicial/empenhos/${uuid}/`, payload);
};
