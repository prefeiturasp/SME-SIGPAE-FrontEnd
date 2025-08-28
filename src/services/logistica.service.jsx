import axios from "./_base";
import { saveAs } from "file-saver";
import { ErrorHandlerFunction } from "./service-helpers";

export const getNomesDistribuidores = async () =>
  await axios.get("/terceirizadas/lista-nomes-distribuidores/");

export const getNumerosRequisicoes = async () =>
  await axios.get("/solicitacao-remessa/lista-numeros/");

export const getRequisicoesDoFiltro = async (queryparams) => {
  let url = `/solicitacao-remessa/lista-requisicoes-para-envio/`;
  if (queryparams) url += "?" + queryparams + "&&param=01/";
  return await axios.get(url);
};

export const getRequisicoesListagem = async (params) => {
  const url = `/solicitacao-remessa/`;
  return await axios.get(url, { params });
};

export const getNomesUnidadesEscolares = async (params) => {
  const url = "/guias-da-requisicao/unidades-escolares/";
  return await axios.get(url, { params });
};

export const distribuidorConfirma = async (uuid) => {
  const url = `/solicitacao-remessa/${uuid}/distribuidor-confirma/`;
  return await axios.patch(url);
};

export const distribuidorConfirmaTodos = async () => {
  const url = `/solicitacao-remessa/distribuidor-confirma-todos/`;
  return await axios.patch(url);
};

export const getConsolidadoAlimentos = async (uuid) => {
  const url = `/solicitacao-remessa/${uuid}/consolidado-alimentos/`;
  return await axios.get(url);
};

export const distribuidorAltera = async (payload) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/`;
  return await axios.post(url, payload);
};

export const gerarPDFDistribuidorSolicitacao = async (uuid) => {
  const url = `/solicitacao-remessa/${uuid}/gerar-pdf-distribuidor/`;
  return await axios.get(url);
};

export const gerarPDFDistribuidorSolicitacoes = async (params) => {
  const url = `/solicitacao-remessa/gerar-pdf-distribuidor-geral/`;
  return await axios.get(url, { params, responseType: "blob" });
};

export const gerarExcelSolicitacoes = async (params) => {
  const url = `/solicitacao-remessa/exporta-excel-visao-analitica/`;
  return await axios.get(url, { params });
};

export const gerarPDFDistribuidorGuia = async (uuid) => {
  const url = `/guias-da-requisicao/${uuid}/gerar-pdf-distribuidor/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "guia_de_remessa.pdf");
};

export const getListagemSolicitacaoAlteracao = async (params) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/`;
  return await axios.get(url, { params });
};

export const dilogAceitaAlteracao = async (uuid, params) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/${uuid}/dilog-aceita-alteracao/`;
  return await axios.patch(url, params);
};

export const dilogNegaAlteracao = async (uuid, params) => {
  const url = `/solicitacao-de-alteracao-de-requisicao/${uuid}/dilog-nega-alteracao/`;
  return await axios.patch(url, params);
};

export const getGuiasRemessaParaInsucesso = async (params) => {
  const url = `/guias-da-requisicao/lista-guias-para-insucesso/`;
  return await axios.get(url, { params });
};

export const getGuiasInconsistencias = async (params) => {
  const url = `/guias-da-requisicao/inconsistencias/`;
  return await axios.get(url, { params });
};

export const vinculaGuiasComEscolas = async (params) => {
  const url = `/guias-da-requisicao/vincula-guias/`;
  return await axios.patch(url, { params });
};

export const getGuiasEscola = async (params) => {
  const url = `/guias-da-requisicao/guias-escola/`;
  return await axios.get(url, { params });
};

export const getGuiaParaConferencia = async (params) => {
  const url = `/guias-da-requisicao/guia-para-conferencia/`;
  return await axios.get(url, { params });
};

export const getGuiaDetalhe = async (uuid) => {
  const url = `/guias-da-requisicao/${uuid}/detalhe-guia-de-remessa/`;
  return await axios.get(url);
};

// TODO: Remover métodos não utilizados de edição daqui e do back
export const getConferenciaParaEdicao = async (params) => {
  const url = `/conferencia-da-guia-com-ocorrencia/get-ultima-conferencia/`;
  return await axios.get(url, { params });
};

export const getReposicaoParaEdicao = async (params) => {
  const url = `/conferencia-da-guia-com-ocorrencia/get-ultima-reposicao/`;
  return await axios.get(url, { params });
};

export const recebeGuiaSemOcorrencia = async (params) => {
  const url = `/conferencia-da-guia/`;
  return await axios.post(url, params);
};

export const registraInsucessoDeEntrega = async (params) => {
  const url = `/insucesso-de-entrega/`;
  return await axios.post(url, params);
};

export const getGuiaParaInsucesso = async (params) => {
  const url = `/guias-da-requisicao/guia-para-insucesso/`;
  return await axios.get(url, { params });
};

export const recebeGuiaComOcorrencia = async (params) => {
  const url = `/conferencia-da-guia-com-ocorrencia/`;
  return await axios.post(url, params);
};

export const editaGuiaComOcorrencia = async (payload) => {
  const url = `/conferencia-da-guia-com-ocorrencia/${payload.uuid_conferencia}/`;
  return await axios.put(url, payload);
};

export const getEntregasDilog = async (params) => {
  const url = `/solicitacao-remessa/lista-requisicoes-confirmadas/`;
  return await axios.get(url, { params });
};

export const gerarExcelEntregas = async (params) => {
  const url = `/solicitacao-remessa/exporta-excel-visao-entregas/`;
  return await axios.get(url, { params });
};

export const arquivaGuias = async (payload) => {
  const url = `/solicitacao-remessa/arquivar/`;
  return await axios.post(url, payload);
};

export const desarquivaGuias = async (payload) => {
  const url = `/solicitacao-remessa/desarquivar/`;
  return await axios.post(url, payload);
};

export const imprimirGuiaRemessa = async (uuid, numero) => {
  const url = `/guias-da-requisicao/${uuid}/relatorio-guia-remessa/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "guia_" + numero + ".pdf");
};

export const imprimirGuiasDaSolicitacao = async (uuid, params) => {
  const url = `/solicitacao-remessa/${uuid}/relatorio-guias-da-requisicao/`;
  return await axios.get(url, { params });
};

export const confirmaCancelamento = async (payload) => {
  const url = `/solicitacao-remessa/confirmar-cancelamento/`;
  return await axios.post(url, payload);
};

export const getGuiasNaoNotificadas = async (params) => {
  const url = `/guias-da-requisicao/guias-com-ocorrencias-sem-notificacao/`;
  return await axios.get(url, { params });
};

export const criarNotificacao = async (payload) => {
  const url = `/notificacao-guias-com-ocorrencias/`;
  return await axios.post(url, payload);
};

export const editarNotificacao = async (uuid, payload) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/edicao-rascunho/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const criarEditarNotificacao = async (uuid, payload) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/criar-notificacao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const enviarNotificacao = async (uuid, payload) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/enviar-notificacao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const solicitarAlteracaoNotificacao = async (uuid, payload) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/solicitar-alteracao/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const assinarEnviarNotificacao = async (uuid, payload) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/assinar/`;
  const response = await axios
    .patch(url, payload, {
      skipAuthRefresh: true,
    })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getNotificacoesOcorrencia = async (params) => {
  const url = `/notificacao-guias-com-ocorrencias/`;
  return await axios.get(url, { params });
};

export const getNotificacoesOcorrenciaByUuid = async (uuid) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/`;
  return await axios.get(url);
};

export const getNotificacao = async (uuid) => {
  const url = `/notificacao-guias-com-ocorrencias/${uuid}/`;
  return await axios.get(url);
};
