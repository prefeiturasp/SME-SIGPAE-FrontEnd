import axios from "src/services/_base";
import { API_URL } from "../constants/config";
import authService from "./auth";
import { FLUXO, PEDIDOS } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

const URL_SOLICITACAO_UNIFICADA = `${API_URL}/solicitacoes-kit-lanche-unificada`;
const MOTIVOS_UNIFICADA = `${API_URL}/motivos-solicitacao-unificada`;

export const criarSolicitacaoUnificada = async (payload) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarSolicitacaoUnificada = (uuid, payload) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: payload,
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

export const inicioPedido = (uuid) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
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

export const solicitacoesUnificadasSalvas = async () => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${PEDIDOS.MEUS}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const removerSolicitacaoUnificada = async (uuid) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const motivosSolicitacaoUnificada = () => {
  const url = `${MOTIVOS_UNIFICADA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};

export const getSolicitacaoUnificada = (uuid) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/`;
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

export const getCODAEPedidosSolicitacoesUnificadas = async (
  filtroAplicado,
  paramsFromPrevPage,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${PEDIDOS.CODAE}/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  return response.data;
};

export const getTerceirizadaPedidosSolicitacoesUnificadas = (
  filtroAplicado,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${PEDIDOS.TERCEIRIZADA}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};

export const CODAEAutorizaPedidoKitLancheUnificado = (
  uuid,
  justificativa = {},
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  let status = 0;
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(justificativa),
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

export const CODAENegaKitLancheUnificadoEscola = async (
  uuid,
  justificativa,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios
    .patch(url, justificativa)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEquestionaSolicitacaoUnificada = async (uuid, payload) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const TerceirizadaTomaCienciaSolicitacoUnificada = (uuid) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.TERCEIRIZADA_TOMA_CIENCIA}/`;
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

export const terceirizadaRespondeQuestionamentoSolitacaoUnificada = async (
  uuid,
  payload,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify(payload),
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const cancelaKitLancheUnificadoDre = async (
  uuid,
  justificativa,
  tipoSolicitacao,
  escolas_selecionadas,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.DRE_CANCELA}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "PATCH",
    body: JSON.stringify({ justificativa, escolas_selecionadas }),
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const cancelaKitLancheUnificadoEscola = async (uuid, justificativa) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios
    .patch(url, { justificativa })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getTerceirizadasPedidosSolicitacoesUnificadas = (
  filtroAplicado,
) => {
  const url = `${URL_SOLICITACAO_UNIFICADA}/${PEDIDOS.TERCEIRIZADA}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};
