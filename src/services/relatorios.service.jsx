import { API_URL } from "../constants/config";
import axios from "./_base";
import { saveAs } from "file-saver";
import { ErrorHandlerFunction } from "./service-helpers";

export const getRelatorioReclamacao = async (params) => {
  const { data } = await axios.get(
    `${API_URL}/produtos/relatorio-reclamacao/`,
    {
      responseType: "blob",
      params,
    }
  );
  saveAs(data, "relatorio_reclamacao.pdf");
};

export const filtrarSolicitacoesAlimentacaoDRE = async (payload) => {
  const response = await axios
    .post(
      `${API_URL}/diretoria-regional-solicitacoes/filtrar-solicitacoes-ga/`,
      payload
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const filtrarSolicitacoesAlimentacaoEscola = async (payload) => {
  const response = await axios
    .post(`${API_URL}/escola-solicitacoes/filtrar-solicitacoes-ga/`, payload)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const filtrarSolicitacoesAlimentacaoCODAE = async (payload) => {
  const response = await axios
    .post(`${API_URL}/codae-solicitacoes/filtrar-solicitacoes-ga/`, payload)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const filtrarSolicitacoesAlimentacaoTerceirizadas = async (payload) => {
  const response = await axios
    .post(
      `${API_URL}/terceirizada-solicitacoes/filtrar-solicitacoes-ga/`,
      payload
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarExcelRelatorioSolicitacoesAlimentacaoDRE = async (
  payload
) => {
  const url = `/diretoria-regional-solicitacoes/exportar-xlsx/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarExcelRelatorioSolicitacoesAlimentacaoEscola = async (
  payload
) => {
  const url = `/escola-solicitacoes/exportar-xlsx/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarExcelRelatorioSolicitacoesAlimentacaoCODAE = async (
  payload
) => {
  const url = `/codae-solicitacoes/exportar-xlsx/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarExcelRelatorioSolicitacoesAlimentacaoTerceirizadas = async (
  payload
) => {
  const url = `/terceirizada-solicitacoes/exportar-xlsx/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPDFRelatorioSolicitacoesAlimentacaoDRE = async (payload) => {
  const url = `/diretoria-regional-solicitacoes/exportar-pdf/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPDFRelatorioSolicitacoesAlimentacaoEscola = async (
  payload
) => {
  const url = `/escola-solicitacoes/exportar-pdf/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPDFRelatorioSolicitacoesAlimentacaoCODAE = async (
  payload
) => {
  const url = `/codae-solicitacoes/exportar-pdf/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPDFRelatorioSolicitacoesAlimentacaoTerceirizadas = async (
  payload
) => {
  const url = `/terceirizada-solicitacoes/exportar-pdf/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesDetalhadas = async (params) => {
  const response = await axios
    .get(`${API_URL}/solicitacoes-genericas/solicitacoes-detalhadas/`, {
      params,
    })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getTotalizadoresRelatorioSolicitacoes = async (payload) => {
  const response = await axios
    .post(
      `${API_URL}/solicitacoes-genericas/filtrar-solicitacoes-cards-totalizadores/`,
      payload
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDatasetsGraficos = async (payload) => {
  const response = await axios
    .post(
      `${API_URL}/solicitacoes-genericas/filtrar-solicitacoes-graficos/`,
      payload
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarPDFRelatorioAlunosMatriculados = async (params) => {
  const url = `/relatorio-alunos-matriculados/gerar-pdf/`;
  const response = await axios
    .get(url, { params: params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const gerarXLSRelatorioAlunosMatriculados = async (params) => {
  const url = `/relatorio-alunos-matriculados/gerar-xlsx/`;
  const response = await axios
    .get(url, { params: params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
