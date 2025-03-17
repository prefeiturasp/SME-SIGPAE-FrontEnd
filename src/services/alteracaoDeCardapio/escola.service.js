import { ENDPOINT } from "constants/shared";
import { FLUXO, TIPO_SOLICITACAO } from "services/constants";
import { ErrorHandlerFunction } from "services/service-helpers";
import axios from "../_base";
import { getPath } from "./helper";

export const escolaIniciarSolicitacaoDeAlteracaoDeCardapio = async (
  uuid,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaCriarSolicitacaoDeAlteracaoCardapio = async (
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaAlterarSolicitacaoDeAlteracaoCardapio = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaExcluirSolicitacaoDeAlteracaoCardapio = async (
  uuid,
  tipoSolicitacao
) => {
  let url = `${ENDPOINT.ALTERACOES_CARDAPIO}/${uuid}/`;
  if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
    url = `${ENDPOINT.ALTERACOES_CARDAPIO_CEI}/${uuid}/`;
  }
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getRascunhosAlteracaoTipoAlimentacao = async (tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${ENDPOINT.MINHAS_SOLICITACOES}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaCancelarSolicitacaoDeAlteracaoDeCardapio = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAlteracaoCEMEI = async (uuid) => {
  const url = `alteracoes-cardapio-cemei/`;
  const response = await axios
    .get(`${url}${uuid}/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaCancelarSolicitacaoDeAlteracaoDeCardapioCEMEI = async (
  uuid,
  payload
) => {
  const url = `alteracoes-cardapio-cemei/${uuid}/escola-cancela-pedido-48h-antes/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

// FIXME: Revisar nome do método
export const getAlunosPorFaixaEtariaNumaData = async (
  periodoUUID,
  dataReferencia
) => {
  const url = `/${ENDPOINT.PERIODOS_ESCOLARES}/${periodoUUID}/alunos-por-faixa-etaria/${dataReferencia}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSomatorioFaixas = async (escola_id, dataReferencia) => {
  const url = `/escola-quantidade-alunos-por-periodo-e-faixa-etaria/${escola_id}/somatorio-faixas-etarias/${dataReferencia}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolaPeriodoEscolares = async () => {
  const url = `/${ENDPOINT.QUANTIDADE_ALUNOS_POR_PERIODO}/`;
  return axios.get(url);
};

export const getPeriodosComMatriculadosPorUE = async (uuid) => {
  const url = `/${ENDPOINT.PERIODOS_COM_MATRICULADOS_POR_UE}/?escola_uuid=${uuid}/`;
  return axios.get(url);
};

export const createAlteracaoCardapioCEMEI = async (payload) => {
  const url = `alteracoes-cardapio-cemei/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAlteracaoCEMEIRascunhos = async () => {
  const url = `alteracoes-cardapio-cemei/`;
  const response = await axios
    .get(url, { params: { status: "RASCUNHO" } })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteAlteracaoAlimentacaoCEMEI = async (uuid) => {
  const url = `alteracoes-cardapio-cemei/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const iniciaFluxoAlteracaoAlimentacaoCEMEI = async (uuid) => {
  const url = `alteracoes-cardapio-cemei/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateAlteracaoCardapioCEMEI = async (uuid, payload) => {
  const url = `alteracoes-cardapio-cemei/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
