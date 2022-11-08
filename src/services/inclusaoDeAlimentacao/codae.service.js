import axios from "../_base";
import authService from "../auth";
import { PEDIDOS, FLUXO, TIPO_SOLICITACAO } from "../constants";
import { getPath } from "./helper";
import { ErrorHandlerFunction } from "services/service-helpers";

const { SOLICITACAO_CEI } = TIPO_SOLICITACAO;

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const codaeListarSolicitacoesDeInclusaoDeAlimentacao = async (
  filtroAplicado,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.CODAE}/${filtroAplicado}/`;

  if (tipoSolicitacao === SOLICITACAO_CEI) {
    const response = await axios.get(url);
    const results = response.data.results;
    return {
      results: results.map(el => ({
        ...el,
        tipoSolicitacao: SOLICITACAO_CEI
      })),
      status: response.status
    };
  }

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const status = result.status;
    const json = await result.json();
    return { results: json.results, status };
  } catch (error) {
    console.log(error);
  }
};

export const codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao = (
  uuid,
  justificativa = {},
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(justificativa),
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const codaeNegarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
