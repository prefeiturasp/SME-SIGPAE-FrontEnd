import axios from "../_base";
import { FLUXO, PEDIDOS } from "src/services/constants";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import { getPath } from "./helper";

// TODO Rever métodos get por prioridade. Esse já consolida todos em um consulta única.
export const dreListarSolicitacoesDeAlteracaoDeCardapio = async (
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

export const dreValidarSolicitacaoDeAlteracaoDeCardapio = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.DRE_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const dreReprovarSolicitacaoDeAlteracaoDeCardapio = async (
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
