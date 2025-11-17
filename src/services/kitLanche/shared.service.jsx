import { TIPO_SOLICITACAO } from "src/constants/shared";
import axios from "src/services/_base";
import { AUTH_TOKEN, FLUXO, PEDIDOS } from "src/services/constants";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import { getPath } from "./helper";

export const removeKitLanche = async (uuid, tipoSolicitacao) => {
  //TODO: conferir params
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "DELETE",
  };
  let status = 0;
  return await fetch(`${getPath(tipoSolicitacao)}/${uuid}/`, OBJ_REQUEST)
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

export const inicioPedido = (uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;

  if (tipoSolicitacao) {
    return axios.patch(url);
  }

  let status = 0;
  return fetch(url, {
    method: "PATCH",
    headers: AUTH_TOKEN,
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

export const getSolicitacoesKitLanche = async (tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.MEUS}/`;

  if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
    return axios.get(url);
  }

  const response = await axios({ url: url });
  return response.data;
};

export const getKitLanches = async (params = null) => {
  const url = `/kit-lanches/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDetalheKitLancheAvulsa = (uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error);
    });
};

export const getKitsLanche = async (params) => {
  const url = `/kit-lanches/consulta-kits/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
