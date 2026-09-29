import axios from "../_base";
import {
  PEDIDOS,
  FLUXO,
  AUTH_TOKEN,
  URL_INCLUSAO_PAINEL,
} from "src/services/constants";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import { getPath } from "./helper";

export const dreListarSolicitacoesDeInclusaoDeAlimentacao = async (
  filtroAplicado,
  paramsFromPrevPage,
) => {
  const url = `${URL_INCLUSAO_PAINEL}/${PEDIDOS.DRE}/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  return response.data;
};

export const dreListarSolicitacoesDeInclusaoDeAlimentacaoReprovados = (
  tipoSolicitacao,
) => {
  const url = `${getPath(
    tipoSolicitacao,
  )}/pedidos-reprovados-diretoria-regional/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch(() => {});
};

export const dreValidarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao,
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.DRE_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const dreReprovarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao,
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
