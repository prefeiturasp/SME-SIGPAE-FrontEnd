import { API_URL } from "../constants/config";
import { ENDPOINT } from "../constants/shared";
import { SOLICITACOES_DIETA } from "./constants";
import authService from "./auth";

import axios from "./_base";
import {
  PANORAMA_ESCOLA,
  RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP,
  RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP,
  RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP,
  SOLICITACOES_DIETA_ESPECIAL
} from "configs/constants";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

const URL_DIETA_ESPECIAL = `${API_URL}/solicitacoes-dieta-especial`;

const retornoBase = async url => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const status = result.status;
    const json = await result.json();
    if (json.results) {
      return { results: json.results, status };
    }
    return { results: json, status };
  } catch (error) {
    console.log(error);
  }
};

export const criaDietaEspecial = async payload => {
  const url = `${URL_DIETA_ESPECIAL}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "POST",
    body: JSON.stringify(payload)
  };
  try {
    const response = await fetch(url, OBJ_REQUEST);
    const status = await response.status;
    const json = await response.json();
    return { data: json, status: status };
  } catch (error) {
    console.log(error);
  }
};

export const getDietaEspecial = async uuid => {
  const url = `${URL_DIETA_ESPECIAL}/${uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const response = await fetch(url, OBJ_REQUEST);
    const status = response.status;
    const json = await response.json();
    return { data: json, status: status };
  } catch (error) {
    console.log(error);
  }
};

export const getDietasEspeciaisVigentesDeUmAluno = async codigo_eol_aluno => {
  const url = `${URL_DIETA_ESPECIAL}/solicitacoes-aluno/${codigo_eol_aluno}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  try {
    const response = await fetch(url, OBJ_REQUEST);
    const status = response.status;
    const json = await response.json();
    return { data: json, status: status };
  } catch (error) {
    console.log(error);
  }
};

export const atualizaDietaEspecial = async (uuid, params) =>
  await axios.patch(`/solicitacoes-dieta-especial/${uuid}/`, params);

export const CODAEAutorizaDietaEspecial = async (uuid, params) =>
  await axios.patch(`${ENDPOINT.AUTORIZAR_DIETA(uuid)}/`, params);

export const CODAENegaDietaEspecial = async (uuid, payload) => {
  // TODO: Incluir identificação do nutricionista na negação da dieta
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/negar/`;
  return axios.post(url, payload);
};

export const terceirizadaTomaCienciaDietaEspecial = async uuid => {
  const url = `/solicitacoes-dieta-especial/${uuid}/tomar_ciencia/`;
  return axios.post(url);
};

export const getAlergiasIntolerancias = async () => {
  const url = `${API_URL}/alergias-intolerancias/`;
  const response = await retornoBase(url);
  return {
    status: response.status,
    results: response.results.map(r => {
      return {
        uuid: r.id.toString(),
        nome: r.descricao
      };
    })
  };
};

export const getAlergiasIntoleranciasAxios = async () =>
  axios.get("/alergias-intolerancias/");

export const getClassificacoesDietaEspecial = async () => {
  const url = `${API_URL}/classificacoes-dieta/`;
  return retornoBase(url);
};

export const escolaCancelaSolicitacao = async (uuid, payload) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/escola-cancela-dieta-especial/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
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
      return error;
    });
};

export const escolaInativaDietaEspecial = async (uuid, payload) => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/escola-solicita-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(payload),
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
      return error;
    });
};

export const CODAEAutorizaInativacaoDietaEspecial = async uuid => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/codae-autoriza-inativacao/`;
  return fetch(url, {
    method: "PATCH",
    headers: authToken
  });
};

export const CODAENegaInativacaoDietaEspecial = async uuid => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/codae-nega-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
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
      return error;
    });
};

export const terceirizadaTomaCienciaInativacaoDietaEspecial = async uuid => {
  const url = `${API_URL}/solicitacoes-dieta-especial/${uuid}/terceirizada-toma-ciencia-inativacao/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
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
      return error;
    });
};

export const getDietasAtivasInativasPorAluno = async (params = {}) => {
  const response = await axios.get(
    `${ENDPOINT.SOLICITACOES_DIETA_ESPECIAL_ATIVAS_INATIVAS}/`,
    { params }
  );
  return response;
};

export const getAlimentos = async params => {
  return await axios.get(`${ENDPOINT.ALIMENTOS}/`, { params });
};

export const getSolicitacaoDietaEspecial = async uuid => {
  const url = `${SOLICITACOES_DIETA}/${uuid}/`;
  return axios.get(url);
};

export const getProtocolosDietaEspecial = async () => {
  return await axios.get(`/protocolo-dieta-especial/lista-nomes/`);
};

export const cadastraProtocoloDietaEspecial = async payload => {
  return await axios.post(`/protocolo-dieta-especial/`, payload);
};

export const cadastraProtocoloPadraoDietaEspecial = async payload => {
  return await axios.post(`/protocolo-padrao-dieta-especial/`, payload);
};

export const getRelatorioQuantitativoSolicDietaEsp = async (filtros, page) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP}/`,
    filtros,
    {
      params: { page }
    }
  );
};

export const getRelatorioQuantitativoDiagDietaEsp = async (filtros, page) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_DIAG_DIETA_ESP}/`,
    filtros,
    {
      params: { page }
    }
  );
};

export const getRelatorioQuantitativoClassificacaoDietaEsp = async (
  filtros,
  page
) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP}/`,
    filtros,
    {
      params: { page }
    }
  );
};

export const getSolicitacaoDietaEspecialListagem = async (filtros, params) => {
  return axios.post(
    `/${SOLICITACOES_DIETA_ESPECIAL}/relatorio-dieta-especial/`,
    filtros,
    {
      params: params
    }
  );
};

export const getPanoramaEscola = async filtros =>
  axios.post(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`, filtros);

export const getTiposDeContagem = async () => axios.get("/tipo-contagem/");

export const getSolicitacoesDietaEspecial = async params => {
  return axios.get(`/${SOLICITACOES_DIETA_ESPECIAL}/`, { params });
};

export const getMotivosAlteracaoUE = async params => {
  return axios.get("motivo-alteracao-ue/", { params });
};

export const createSolicitacaoAlteracaoUE = async payload => {
  return axios.post(`/${SOLICITACOES_DIETA_ESPECIAL}/alteracao-ue/`, payload);
};

export const getNomesProtocolos = async () =>
  axios.get("/protocolo-padrao-dieta-especial/nomes/");

export const getNomesProtocolosValidos = async () =>
  axios.get("/protocolo-padrao-dieta-especial/lista-protocolos-liberados/");

export const getStatusProtocolos = async () =>
  axios.get("/protocolo-padrao-dieta-especial/lista-status/");

export const consultaProtocoloPadrao = async params =>
  axios.get(`/protocolo-padrao-dieta-especial/`, { params });

export const getProtocoloPadrao = async params =>
  axios.get(`/protocolo-padrao-dieta-especial/${params}/`);

export const editaProtocoloPadraoDietaEspecial = async payload => {
  return await axios.put(
    `/protocolo-padrao-dieta-especial/${payload.uuid}/`,
    payload
  );
};

export const consultaHistoricoProtocoloPadrao = async uuid => {
  return await axios.get(`/protocolo-padrao-dieta-especial/${uuid}/historico/`);
};
