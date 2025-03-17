import axios from "../_base";
import { FLUXO, AUTH_TOKEN } from "services/constants";
import { ErrorHandlerFunction } from "services/service-helpers";
import { getPath } from "./helper";

export const getTerceirizadaPedidosReprovados = (tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/pedidos-reprovados-terceirizada/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const TerceirizadaTomaCienciaAlteracaoCardapio = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${
    FLUXO.TERCEIRIZADA_TOMA_CIENCIA
  }/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const terceirizadaRespondeQuestionamentoAlteracaoCardapio = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${
    FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO
  }/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
