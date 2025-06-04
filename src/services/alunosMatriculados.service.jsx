import { API_URL } from "../constants/config";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

export const getFiltros = async () => {
  const url = `${API_URL}/relatorio-alunos-matriculados/filtros/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const filtrarAlunosMatriculados = async (params) => {
  const url = `${API_URL}/relatorio-alunos-matriculados/filtrar/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
