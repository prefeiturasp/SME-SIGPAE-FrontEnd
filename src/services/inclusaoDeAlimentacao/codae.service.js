import { ErrorHandlerFunction } from "services/service-helpers";
import axios from "../_base";
import { FLUXO, PEDIDOS, TIPO_SOLICITACAO } from "../constants";
import { getPath } from "./helper";

const { SOLICITACAO_CEI } = TIPO_SOLICITACAO;

export const codaeListarSolicitacoesDeInclusaoDeAlimentacao = async (
  filtroAplicado,
  tipoSolicitacao,
  paramsFromPrevPage
) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.CODAE}/${filtroAplicado}/`;

  if (tipoSolicitacao === SOLICITACAO_CEI) {
    const response = await axios
      .get(url, { params: paramsFromPrevPage })
      .catch(ErrorHandlerFunction);
    if (response?.data?.results) {
      const results = response.data.results;
      return {
        results: results.map((el) => ({
          ...el,
          tipoSolicitacao: SOLICITACAO_CEI,
        })),
        status: response.status,
      };
    } else {
      const data = { data: response.data, status: response.status };
      return data;
    }
  } else {
    const response = await axios
      .get(url, { params: paramsFromPrevPage })
      .catch(ErrorHandlerFunction);
    if (response?.data?.results) {
      const results = response.data.results;
      const status = response.status;
      return { results: results, status };
    } else {
      const data = { data: response.data, status: response.status };
      return data;
    }
  }
};

export const codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
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
