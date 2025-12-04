import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { API_URL } from "../constants/config";
import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

export const recuperaSenha = async (registro_funcional) => {
  const url = `${API_URL}/cadastro/recuperar-senha/${registro_funcional}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarSenha = (uuid, confirmationKey, payLoad) => {
  const url = `${API_URL}/cadastro/atualizar-senha/${uuid}/${confirmationKey}/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payLoad),
    headers: { "Content-Type": "application/json" },
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

export const meusDados = async () => {
  const url = `${API_URL}/usuarios/meus-dados/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    return response.data;
  }
};

export const getMeusDados = async (params = {}) => {
  const url = `${API_URL}/usuarios/meus-dados/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarSenhaLogado = async (payload) => {
  const url = `${API_URL}/usuarios/atualizar-senha/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const confirmarEmail = (uuid, confirmationKey) => {
  const url = `${API_URL}/confirmar_email/${uuid}/${confirmationKey}/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

export const obtemDadosAlunoPeloEOL = async (codEOL) => {
  const url = `${API_URL}/dados-alunos-eol/${codEOL}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const dadosDoAluno = async (codigoEol) => {
  const url = `${API_URL}/alunos/${codigoEol}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAlunosListagem = async (params) => {
  const url = `${API_URL}/alunos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPerfilListagem = async (params) =>
  await axios.get(`/perfis/`, { params });

export const getVisoesListagem = async (params) =>
  await axios.get(`/perfis/visoes/`, { params });

export const getPerfisSubordinados = async (params) => {
  const perfil = localStorage.getItem("perfil").replace(/['"]+/g, "");
  try {
    return await axios.get(
      `/perfis-vinculados/${perfil}/perfis-subordinados/`,
      {
        params,
      },
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const aceitarTermos = async (uuid) => {
  try {
    return await axios.patch(`/usuarios/${uuid}/aceitar-termos/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};
