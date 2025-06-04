import axios from "../../_base";
import { API_URL } from "src/constants/config";
import { ErrorHandlerFunction } from "../../service-helpers";
import { NovoRelatorioVisitasFormInterface } from "interfaces/imr.interface";
import {
  ResponseEquipamentoInterface,
  ResponseExportarPDFAssincronoInterface,
  ResponseFormularioSupervisaoTiposOcorrenciasInterface,
  ResponseInsumoInterface,
  ResponseMobiliarioInterface,
  ResponsePeriodosDeVisitaInterface,
  ResponseReparoEAdaptacaoInterface,
  ResponseUtensilioCozinhaInterface,
  ResponseUtensilioMesaInterface,
} from "interfaces/responses.interface";

export const getPeriodosVisita = async () => {
  const url = `${API_URL}/imr/periodos-de-visita/`;
  const response: ResponsePeriodosDeVisitaInterface = await axios
    .get(url)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createRascunhoFormularioSupervisao = async (
  params: NovoRelatorioVisitasFormInterface
) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateRascunhoFormularioSupervisao = async (
  params: NovoRelatorioVisitasFormInterface
) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/${params.uuid}/`;
  const response = await axios.put(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createFormularioSupervisao = async (
  params: NovoRelatorioVisitasFormInterface
) => {
  const url = `${API_URL}/imr/formulario-supervisao/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateFormularioSupervisao = async (
  params: NovoRelatorioVisitasFormInterface
) => {
  const url = `${API_URL}/imr/formulario-supervisao/${params.uuid}/`;
  const response = await axios.put(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteFormularioSupervisao = async (params: { uuid: string }) => {
  const url = `${API_URL}/imr/rascunho-formulario-supervisao/${params.uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getFormularioSupervisao = async (uuid: string) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getRespostasFormularioSupervisao = async (uuid: string) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/respostas/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getRespostasNaoSeAplicaFormularioSupervisao = async (
  uuid: string
) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/respostas_nao_se_aplica/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createFormularioDiretor = async (
  params: NovoRelatorioVisitasFormInterface
) => {
  const url = `${API_URL}/imr/formulario-diretor/`;
  const response = await axios.post(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getTiposOcorrenciaPorEditalNutrisupervisao = async (params: {
  edital_uuid: string;
  escola_uuid: string;
}) => {
  const url = `${API_URL}/imr/formulario-supervisao/tipos-ocorrencias/`;
  const response: ResponseFormularioSupervisaoTiposOcorrenciasInterface =
    await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getTiposOcorrenciaPorEditalDiretor = async (params: {
  edital_uuid: string;
}) => {
  const url = `${API_URL}/imr/formulario-diretor/tipos-ocorrencias/`;
  const response: ResponseFormularioSupervisaoTiposOcorrenciasInterface =
    await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getUtensiliosCozinha = async (params: { edital_uuid: string }) => {
  const url = `${API_URL}/imr/utensilios-cozinha/`;
  const response: ResponseUtensilioCozinhaInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getUtensiliosMesa = async (params: { edital_uuid: string }) => {
  const url = `${API_URL}/imr/utensilios-mesa/`;
  const response: ResponseUtensilioMesaInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEquipamentos = async (params: { edital_uuid: string }) => {
  const url = `${API_URL}/imr/equipamentos/`;
  const response: ResponseEquipamentoInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getMobiliarios = async (params: { edital_uuid: string }) => {
  const url = `${API_URL}/imr/mobiliarios/`;
  const response: ResponseMobiliarioInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getReparosEAdaptacoes = async (params: {
  edital_uuid: string;
}) => {
  const url = `${API_URL}/imr/reparos-e-adaptacoes/`;
  const response: ResponseReparoEAdaptacaoInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getInsumos = async (params: { edital_uuid: string }) => {
  const url = `${API_URL}/imr/insumos/`;
  const response: ResponseInsumoInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const exportarPDFRelatorioFiscalizacao = async (params: {
  uuid: string;
}) => {
  const url = `${API_URL}/imr/formulario-supervisao/${params.uuid}/relatorio-pdf/`;
  const response: ResponseExportarPDFAssincronoInterface = await axios
    .get(url)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const exportarPDFRelatorioNotificacao = async (uuid: string) => {
  const url = `${API_URL}/imr/formulario-supervisao/${uuid}/gerar-relatorio-notificacoes/`;
  const response: ResponseExportarPDFAssincronoInterface = await axios
    .get(url)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
