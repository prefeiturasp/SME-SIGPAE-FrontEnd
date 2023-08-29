import { FLUXO, AUTH_TOKEN } from "services/constants";
import { ErrorHandlerFunction } from "services/service-helpers";
import { getPath } from "./helper";
import axios from "../_base";

export const obterSolicitacaoDeInclusaoDeAlimentacao = (
  uuid,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;
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

export const obterMinhasSolicitacoesDeInclusaoDeAlimentacao = async (
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/minhas-solicitacoes/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const inicioPedido = (uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: AUTH_TOKEN,
  })
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
