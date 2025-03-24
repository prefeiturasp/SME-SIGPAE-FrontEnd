import axios from "./_base";
import { API_URL } from "../constants/config";
import { FLUXO } from "./constants";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const getInversoesDeDiaDeCardapio = async () => {
  const url = `${API_URL}/inversoes-dia-cardapio/minhas-solicitacoes/`;
  const OBJ_REQUEST = {
    headers: authToken,
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

export const criarInversaoDeDiaDeCardapio = async (values) => {
  const url = `${API_URL}/inversoes-dia-cardapio/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "POST",
    body: JSON.stringify(values),
  };
  let status = 0;
  return await fetch(url, OBJ_REQUEST)
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

export const atualizarInversaoDeDiaDeCardapio = (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "PUT",
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
      return error.json();
    });
};

export const getInversaoDeDiaDeCardapio = (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
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
      return error.json();
    });
};

export const removerInversaoDeDiaDeCardapio = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "DELETE",
  };
  let status = 0;
  return await fetch(url, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return { data: error, status: status };
    });
};

export const inicioPedido = (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/inicio-pedido/`;
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
      return error.json();
    });
};

export const dreValidaPedidoEscola = (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/diretoria-regional-valida-pedido/`;
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
      return error.json();
    });
};

export const DRENegaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAutorizaPedidoDRE = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAENegaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEQuestionaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const TerceirizadaRespondeQuestionamentoInversaoDeDiaDeCardapio = (
  uuid,
  payload
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO}/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: authToken,
    body: JSON.stringify(payload),
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

export const terceirizadaTomaCiencia = (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/terceirizada-toma-ciencia/`;
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
      return error.json();
    });
};

export const getDREPedidosDeInversoes = async (
  filtroAplicado,
  paramsFromPrevPage
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-diretoria-regional/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  const results = response.data.results;
  const status = response.status;
  return { results: results, status };
};

export const getCODAEPedidosDeInversoes = async (
  filtroAplicado,
  paramsFromPrevPage
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-codae/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  return response.data;
};

export const getTerceirizadaPedidosDeInversoes = (filtroAplicado) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-terceirizadas/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
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

export const escolaCancelaInversaoDiaCardapio = async (uuid, justificativa) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios
    .patch(url, { justificativa })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
