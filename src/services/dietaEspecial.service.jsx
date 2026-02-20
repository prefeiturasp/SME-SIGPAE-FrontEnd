import {
  PANORAMA_ESCOLA,
  RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP,
  RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP,
  RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { API_URL } from "../constants/config";
import { ENDPOINT } from "../constants/shared";
import authService from "./auth";
import { SOLICITACOES_DIETA } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

const URL_DIETA_ESPECIAL = `${API_URL}/solicitacoes-dieta-especial`;

export const criaDietaEspecial = async (payload) => {
  const url = `${URL_DIETA_ESPECIAL}/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecial = async (uuid) => {
  const url = `${URL_DIETA_ESPECIAL}/${uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  try {
    const response = await fetch(url, OBJ_REQUEST);
    const status = response.status;
    const json = await response.json();
    return { data: json, status: status };
  } catch (error) {
    return error;
  }
};

export const getDietasEspeciaisVigentesDeUmAluno = async (
  codigo_eol_aluno,
  codigo_eol_escola = null,
) => {
  let url = `${URL_DIETA_ESPECIAL}/solicitacoes-aluno/${codigo_eol_aluno}/`;

  const params = {};
  if (codigo_eol_escola) {
    params.codigo_eol_escola = codigo_eol_escola;
  }

  try {
    const response = await axios.get(url, { params });
    return { data: response.data, status: response.status };
  } catch (err) {
    ErrorHandlerFunction(err);
  }
};

export const atualizaDietaEspecial = async (uuid, params) =>
  await axios.patch(`/solicitacoes-dieta-especial/${uuid}/`, params);

export const CODAEAutorizaDietaEspecial = async (uuid, params) =>
  await axios.patch(`${ENDPOINT.AUTORIZAR_DIETA(uuid)}/`, params);

export const CODAEAtualizaProtocoloDietaEspecial = async (uuid, params) => {
  const url = `${ENDPOINT.ATUALIZA_PROTOCOLO_DIETA(uuid)}/`;
  const response = await axios.patch(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAENegaDietaEspecial = async (uuid, payload) => {
  // TODO: Incluir identificação do nutricionista na negação da dieta
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/negar/`;
  return axios.post(url, payload);
};

export const CODAENegaSolicitacaoCancelamento = async (uuid, payload) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/negar-cancelamento-dieta-especial/`;
  return axios.post(url, payload);
};

export const terceirizadaTomaCienciaDietaEspecial = async (uuid) => {
  const url = `/solicitacoes-dieta-especial/${uuid}/tomar_ciencia/`;
  return axios.post(url);
};

export const getAlergiasIntolerancias = async () => {
  const url = `${API_URL}/alergias-intolerancias/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getClassificacoesDietaEspecial = async () => {
  const url = `${API_URL}/classificacoes-dieta/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaCancelaSolicitacao = async (uuid, payload) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/escola-cancela-dieta-especial/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const escolaInativaDietaEspecial = async (uuid, payload) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/escola-solicita-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const terceirizadaMarcaConferencia = async (uuid, endpoint) => {
  const url = `${API_URL}/${endpoint}/${uuid}/marcar-conferida/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAutorizaInativacaoDietaEspecial = async (uuid) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/codae-autoriza-inativacao/`;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
  });
};

export const CODAENegaInativacaoDietaEspecial = async (uuid) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/codae-nega-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const terceirizadaTomaCienciaInativacaoDietaEspecial = async (uuid) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/terceirizada-toma-ciencia-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error;
    });
};

export const getDietasAtivasInativasPorAluno = async (params = {}) => {
  const response = await axios.get(
    `${ENDPOINT.SOLICITACOES_DIETA_ESPECIAL_ATIVAS_INATIVAS}/`,
    { params },
  );
  return response;
};

export const getAlimentos = async (params) => {
  return await axios.get(`${ENDPOINT.ALIMENTOS}/`, { params });
};

export const getSolicitacaoDietaEspecial = async (uuid) => {
  const url = `${SOLICITACOES_DIETA}/${uuid}/`;
  return axios.get(url);
};

export const getProtocolosDietaEspecial = async () => {
  return await axios.get(`/protocolo-dieta-especial/lista-nomes/`);
};

export const cadastraProtocoloDietaEspecial = async (payload) => {
  return await axios.post(`/protocolo-dieta-especial/`, payload);
};

export const cadastraProtocoloPadraoDietaEspecial = async (payload) => {
  return await axios.post(`/protocolo-padrao-dieta-especial/`, payload);
};

export const getRelatorioQuantitativoSolicDietaEsp = async (filtros, page) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP}/`,
    filtros,
    {
      params: { page },
    },
  );
};

export const getRelatorioQuantitativoDiagDietaEsp = async (filtros, page) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP}/`,
    filtros,
    {
      params: { page },
    },
  );
};

export const getRelatorioQuantitativoClassificacaoDietaEsp = async (
  filtros,
  page,
) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP}/`,
    filtros,
    {
      params: { page },
    },
  );
};

export const getSolicitacaoDietaEspecialListagem = async (filtros, params) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/relatorio-dieta-especial/`,
    filtros,
    {
      params: params,
    },
  );
};

export const getPanoramaEscola = async (filtros) =>
  axios.post(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`, filtros);

export const getTiposDeContagem = async () => axios.get("/tipo-contagem/");

export const getSolicitacoesDietaEspecial = async (params) => {
  return axios.get(`/${SOLICITACOES_DIETA_ESPECIAL}/`, { params });
};

export const getMotivosAlteracaoUE = async (params) => {
  return axios.get("motivo-alteracao-ue/", { params });
};

export const createSolicitacaoAlteracaoUE = async (payload) => {
  return axios.post(`/${SOLICITACOES_DIETA_ESPECIAL}/alteracao-ue/`, payload);
};

export const getNomesProtocolos = async () =>
  axios.get("/protocolo-padrao-dieta-especial/nomes/");

export const getNomesProtocolosValidos = async (payload) =>
  axios.get(`/protocolo-padrao-dieta-especial/lista-protocolos-liberados/`, {
    params: payload,
  });

export const getStatusProtocolos = async () =>
  axios.get("/protocolo-padrao-dieta-especial/lista-status/");

export const consultaProtocoloPadrao = async (params) =>
  axios.get(`/protocolo-padrao-dieta-especial/`, { params });

export const getProtocoloPadrao = async (params) =>
  axios.get(`/protocolo-padrao-dieta-especial/${params}/`);

export const editaProtocoloPadraoDietaEspecial = async (payload) => {
  return await axios.put(
    `/protocolo-padrao-dieta-especial/${payload.uuid}/`,
    payload,
  );
};

export const getFiltrosRelatorioDietasEspeciais = async (params) => {
  const url = `/solicitacoes-dieta-especial/filtros-relatorio-dieta-especial/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesRelatorioDietasEspeciais = async (params) => {
  const url = `/solicitacoes-dieta-especial/relatorio-dieta-especial-terceirizada/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesRelatorioHistoricoDietas = async (params) => {
  const url = `/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const exportarExcelAsyncSolicitacoesRelatorioHistoricoDietas = async (
  params,
) => {
  const url = `/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/exportar-excel/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const exportarPDFAsyncSolicitacoesRelatorioHistoricoDietas = async (
  params,
) => {
  const url = `/solicitacoes-dieta-especial/relatorio-historico-dieta-especial/exportar-pdf/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getUnidadesEducacionaisComCodEol = async (parametros) => {
  return await axios.post(
    `/escolas-simplissima-com-eol/escolas-com-cod-eol/`,
    parametros,
  );
};

export const getUnidadesEducacionaisTercTotal = async (parametros) => {
  return await axios.post(
    `/escolas-simplissima-com-eol/terc-total/`,
    parametros,
  );
};

export const gerarExcelRelatorioDietaEspecial = async (params) => {
  const url = `/solicitacoes-dieta-especial/exportar-xlsx/`;
  const response = await axios
    .get(url, { params, responseType: "blob" })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPdfRelatorioDietaEspecial = async (params) => {
  const url = `/solicitacoes-dieta-especial/exportar-pdf/`;
  const response = await axios
    .get(url, { params, responseType: "blob" })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createSolicitacaoAberta = async (payload) => {
  const url = `solicitacoes-abertas/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateSolicitacaoAberta = async (id) => {
  const url = `solicitacoes-abertas/${id}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteSolicitacaoAberta = async (id) => {
  const url = `solicitacoes-abertas/${id}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getNomesProtocolosValidosPorEdital = async (payload) =>
  axios.get(
    `/protocolo-padrao-dieta-especial/lista-protocolos-liberados-por-edital/`,
    {
      params: payload,
    },
  );

export const vincularProtocolosEditais = async (payload) => {
  return await axios.put(
    `/protocolo-padrao-dieta-especial/atualizar-editais/`,
    payload,
  );
};

export const getDadosAlunoNaoMatriculadoDetalhesDieta = async (
  codigo_eol_escola,
  nome_aluno,
) => {
  const url = `/alunos/dados-aluno-nao-matriculado-detalhes-dieta/`;
  const response = await axios
    .get(url, { params: { codigo_eol_escola, nome_aluno } })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietasEspeciaisVigentesDeUmAlunoNaoMatriculado = async (
  codigo_eol_escola,
  nome_aluno,
) => {
  const url = `${URL_DIETA_ESPECIAL}/solicitacoes-aluno-nao-matriculado/`;
  const response = await axios
    .get(url, { params: { codigo_eol_escola, nome_aluno } })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getRelatorioRecreioFerias = async (params) => {
  const url = `/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPdfRelatorioRecreioFerias = async (params) => {
  const url = `/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/exportar-pdf/`;
  const response = await axios
    .get(url, { params, responseType: "blob" })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarExcelRelatorioRecreioFerias = async (params) => {
  const url = `/solicitacoes-dieta-especial/relatorio-recreio-nas-ferias/exportar-excel/`;
  const response = await axios
    .get(url, { params, responseType: "blob" })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
