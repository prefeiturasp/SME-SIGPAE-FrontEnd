import axios from "../../_base";
import { API_URL } from "src/constants/config";
import { ErrorHandlerFunction } from "../../service-helpers";
export const getPeriodosVisita = async () => {
  const url = `${API_URL}/imr/periodos-de-visita/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const createRascunhoFormularioSupervisao = async (params) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const updateRascunhoFormularioSupervisao = async (params) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/${params.uuid}/`;
  const response = await axios.put(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const createFormularioSupervisao = async (params) => {
  const url = `${API_URL}/imr/formulario-supervisao/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const updateFormularioSupervisao = async (params) => {
  const url = `${API_URL}/imr/formulario-supervisao/${params.uuid}/`;
  const response = await axios.put(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const deleteFormularioSupervisao = async (params) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/${params.uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getFormularioSupervisao = async (uuid) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getRespostasFormularioSupervisao = async (uuid) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/respostas/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getRespostasNaoSeAplicaFormularioSupervisao = async (uuid) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/respostas_nao_se_aplica/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const createFormularioDiretor = async (params) => {
  const url = `${API_URL}/imr/formulario-diretor/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getTiposOcorrenciaPorEditalNutrisupervisao = async (params) => {
  const url = `${API_URL}/imr/formulario-supervisao/tipos-ocorrencias/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getTiposOcorrenciaPorEditalDiretor = async (params) => {
  const url = `${API_URL}/imr/formulario-diretor/tipos-ocorrencias/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getUtensiliosCozinha = async (params) => {
  const url = `${API_URL}/imr/utensilios-cozinha/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getUtensiliosMesa = async (params) => {
  const url = `${API_URL}/imr/utensilios-mesa/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getEquipamentos = async (params) => {
  const url = `${API_URL}/imr/equipamentos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getMobiliarios = async (params) => {
  const url = `${API_URL}/imr/mobiliarios/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getReparosEAdaptacoes = async (params) => {
  const url = `${API_URL}/imr/reparos-e-adaptacoes/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getInsumos = async (params) => {
  const url = `${API_URL}/imr/insumos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const exportarPDFRelatorioFiscalizacao = async (params) => {
  const url = `${API_URL}/imr/formulario-supervisao/${params.uuid}/relatorio-pdf/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const exportarPDFRelatorioNotificacao = async (uuid) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/gerar-relatorio-notificacoes/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
