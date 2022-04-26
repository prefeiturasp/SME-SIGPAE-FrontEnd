import axios from "./_base";
import { API_URL } from "../constants/config";
import authService from "./auth";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const buscaPeriodosEscolares = () => {
  // TODO: pegar periodos escolares da escola ex: escolas/periodos
  const url = `${API_URL}/periodos-escolares/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolas = () => {
  const url = `${API_URL}/escolas/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasSimples = () => {
  const url = `${API_URL}/escolas-simples/?limit=1034`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasSimplissima = (params = {}) => {
  let url = new URL(`${API_URL}/escolas-simplissima/`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasSimplissimaComDRE = () => {
  const url = `${API_URL}/escolas-simplissima-com-dre/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasSimplissimaComDREUnpaginated = async () =>
  axios.get("escolas-simplissima-com-dre-unpaginated/");

export const getEscolasTrecTotal = async () =>
  axios.get("escolas-simplissima-com-dre-unpaginated/terc-total/");

export const getEscolasSimplissimaPorDiretoriaRegional = dre_uuid => {
  const url = `${API_URL}/escolas-simplissima/${dre_uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getTiposGestao = () => {
  const url = `${API_URL}/tipos-gestao/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getSubprefeituras = () => {
  const url = `${API_URL}/subprefeituras/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getQuantidaDeAlunosPorPeriodoEEscola = uuidEscola => {
  const url = `${API_URL}/quantidade-alunos-por-periodo/escola/${uuidEscola}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolaSimples = async uuidEscola =>
  axios.get(`/escolas-simples/${uuidEscola}/`);

export const updateEscolaSimples = async (uuidEscola, valores) =>
  axios.patch(`/escolas-simples/${uuidEscola}/`, valores);
