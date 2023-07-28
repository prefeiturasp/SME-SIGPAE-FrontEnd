import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

import axios from "./_base";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

const fetchPatch = (url, body) => {
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(body),
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

const fetchGet = url => {
  let status = 0;
  return fetch(url, {
    method: "GET",
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

const fetchPost = (url, body) => {
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
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

export const getDadosUsuarioEOL = async registroFuncional =>
  axios.get(`/dados-usuario-eol/${registroFuncional}/`);

export const getDadosUsuarioEOLCompleto = async registroFuncional =>
  axios
    .get(`/dados-usuario-eol-completo/${registroFuncional}/`)
    .catch(ErrorHandlerFunction);

export const criarEquipeAdministradoraEscola = (uuid, registro_funcional) =>
  fetchPost(
    `${API_URL}/vinculos-escolas/${uuid}/criar_equipe_administradora/`,
    {
      registro_funcional
    }
  );

export const getEquipeAdministradoraEscola = uuid =>
  fetchGet(`${API_URL}/vinculos-escolas/${uuid}/get_equipe_administradora/`);

export const finalizarVinculoEscola = (uuid, vinculo_uuid) =>
  fetchPatch(`${API_URL}/vinculos-escolas/${uuid}/finalizar_vinculo/`, {
    vinculo_uuid
  });

export const criarEquipeAdministradoraDiretoriaRegional = (
  uuid,
  registro_funcional
) =>
  fetchPost(
    `${API_URL}/vinculos-diretorias-regionais/${uuid}/criar_equipe_administradora/`,
    {
      registro_funcional
    }
  );

export const getEquipeAdministradoraDiretoriaRegional = uuid =>
  fetchGet(
    `${API_URL}/vinculos-diretorias-regionais/${uuid}/get_equipe_administradora/`
  );

export const finalizarVinculoDiretoriaRegional = (uuid, vinculo_uuid) =>
  fetchPatch(
    `${API_URL}/vinculos-diretorias-regionais/${uuid}/finalizar_vinculo/`,
    {
      vinculo_uuid
    }
  );

export const criarEquipeAdministradoraCODAEGestaoAlimentacaoTerceirizada = (
  uuid,
  registro_funcional
) =>
  fetchPost(
    `${API_URL}/vinculos-codae-gestao-alimentacao-terceirizada/${uuid}/criar_equipe_administradora/`,
    {
      registro_funcional
    }
  );

export const getEquipeAdministradoraCODAEGestaoAlimentacaoTerceirizada = uuid =>
  fetchGet(
    `${API_URL}/vinculos-codae-gestao-alimentacao-terceirizada/${uuid}/get_equipe_administradora/`
  );

export const finalizarVinculoCODAEGestaoAlimentacaoTerceirizada = (
  uuid,
  vinculo_uuid
) =>
  fetchPatch(
    `${API_URL}/vinculos-codae-gestao-alimentacao-terceirizada/${uuid}/finalizar_vinculo/`,
    {
      vinculo_uuid
    }
  );

export const criarEquipeAdministradoraDietaEspecial = (
  uuid,
  registro_funcional
) =>
  fetchPost(
    `${API_URL}/vinculos-codae-gestao-dieta-especial/${uuid}/criar_equipe_administradora/`,
    { registro_funcional }
  );

export const getEquipeAdministradoraDietaEspecial = uuid =>
  fetchGet(
    `${API_URL}/vinculos-codae-gestao-dieta-especial/${uuid}/get_equipe_administradora/`
  );

export const finalizarVinculoDietaEspecial = (uuid, vinculo_uuid) =>
  fetchPatch(
    `${API_URL}/vinculos-codae-gestao-dieta-especial/${uuid}/finalizar_vinculo/`,
    {
      vinculo_uuid
    }
  );

export const criarEquipeAdministradoraGestaoProdutos = (
  uuid,
  registro_funcional
) =>
  fetchPost(
    `${API_URL}/vinculos-codae-gestao-produtos/${uuid}/criar_equipe_administradora/`,
    { registro_funcional }
  );

export const getEquipeAdministradoraGestaoProdutos = uuid =>
  fetchGet(
    `${API_URL}/vinculos-codae-gestao-produtos/${uuid}/get_equipe_administradora/`
  );

export const finalizarVinculoGestaoProdutos = (uuid, vinculo_uuid) =>
  fetchPatch(
    `${API_URL}/vinculos-codae-gestao-produtos/${uuid}/finalizar_vinculo/`,
    {
      vinculo_uuid
    }
  );

export const criarEquipeAdministradoraSupervisaoNutricao = (
  uuid,
  registro_funcional
) =>
  fetchPost(
    `${API_URL}/vinculos-codae-supervisao-nutricao/${uuid}/criar_equipe_administradora/`,
    { registro_funcional }
  );

export const getEquipeAdministradoraSupervisaoNutricao = uuid =>
  fetchGet(
    `${API_URL}/vinculos-codae-supervisao-nutricao/${uuid}/get_equipe_administradora/`
  );

export const finalizarVinculoSupervisaoNutricao = (uuid, vinculo_uuid) =>
  fetchPatch(
    `${API_URL}/vinculos-codae-supervisao-nutricao/${uuid}/finalizar_vinculo/`,
    {
      vinculo_uuid
    }
  );
