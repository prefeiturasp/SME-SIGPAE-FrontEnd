import axios from "../_base";
import { FLUXO, PEDIDOS, AUTH_TOKEN } from "src/services/constants";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import { getPath } from "./helper";

export const getDREPedidosDeKitLanche = async (
  filtroAplicado,
  tipoSolicitacao,
  paramsFromPrevPage
) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.DRE}/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  const results = response.data.results;
  const status = response.status;
  return { results: results, status };
};

export const getDREPedidosDeKitLancheReprovados = (tipoSolicitacao) => {
  const url = `${getPath(
    tipoSolicitacao
  )}/pedidos-reprovados-diretoria-regional/`;
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

export const DREValidaKitLancheAvulso = (uuid, _, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.DRE_VALIDA}/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "PATCH",
  };
  let status = 0;
  return fetch(url, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const DRENaoValidaKitLancheAvulso = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
