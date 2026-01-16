import axios from "../_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const getCategoriasDeMedicao = async () =>
  axios.get("medicao-inicial/categorias-medicao/");

export const setPeriodoLancamento = async (payload) => {
  const url = "medicao-inicial/medicao/";
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getValoresPeriodosLancamentos = async (params) => {
  const url = "medicao-inicial/valores-medicao/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteObservacaoValoresPeriodosLancamentos = async (uuid) => {
  const url = `medicao-inicial/valores-medicao/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateValoresPeriodosLancamentos = async (uuid, params) => {
  const url = `medicao-inicial/medicao/${uuid}/`;
  const response = await axios.patch(url, params).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getMatriculadosPeriodo = async (params) => {
  const url = "matriculados-no-mes/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDiasCalendario = async (params) => {
  const url = "dias-calendario/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getFeriadosNoMes = async (params) => {
  const url = "medicao-inicial/medicao/feriados-no-mes/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getFeriadosNoMesComNome = async (params) => {
  const url = "medicao-inicial/medicao/feriados-no-mes-com-nome/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getLogDietasAutorizadasPeriodo = async (params) => {
  const url = "log-quantidade-dietas-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getLogDietasAutorizadasCEIPeriodo = async (params) => {
  const url = "log-quantidade-dietas-autorizadas-cei/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesInclusoesAutorizadasEscola = async (params) => {
  const url = "escola-solicitacoes/inclusoes-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesInclusoesEtecAutorizadasEscola = async (params) => {
  const url = "escola-solicitacoes/inclusoes-etec-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesInclusoesEventoEspecificoAutorizadasEscola = async (
  params,
) => {
  const url =
    "vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPeriodosInclusaoContinua = async (params) => {
  const url = "periodos-escolares/inclusao-continua-por-mes/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesSuspensoesAutorizadasEscola = async (params) => {
  const url = "escola-solicitacoes/suspensoes-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola =
  async (params) => {
    const url =
      "escola-solicitacoes/ceu-gestao-periodos-com-solicitacoes-autorizadas/";
    const response = await axios
      .get(url, { params })
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  };

export const getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola = async (
  params,
) => {
  const url = "escola-solicitacoes/alteracoes-alimentacao-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesKitLanchesAutorizadasEscola = async (params) => {
  const url = "escola-solicitacoes/kit-lanches-autorizadas/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getLogMatriculadosPorFaixaEtariaDia = async (params) => {
  const url = "log-alunos-matriculados-faixa-etaria-dia/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAlimentacoesLancamentosEspeciais = async () => {
  const response = await axios
    .get("medicao-inicial/alimentacoes-lancamentos-especiais/")
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const criarPermissaoLancamentoEspecial = async (payload) => {
  const url = "medicao-inicial/permissao-lancamentos-especiais/";
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarPermissaoLancamentoEspecial = async (payload, uuid) => {
  const url = `medicao-inicial/permissao-lancamentos-especiais/${uuid}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDiasParaCorrecao = async (params) => {
  const url = "medicao-inicial/dias-para-corrigir/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDiasLetivosRecreio = async (params) => {
  const url = "medicao-inicial/recreio-nas-ferias/dias-letivos/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getUltimoDiaComSolicitacaoAutorizadaNoMes = async (params) => {
  const url =
    "/escola-solicitacoes/ultimo-dia-com-solicitacao-autorizada-no-mes/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getLogDietasAutorizadasRecreioNasFerias = async (params) => {
  const url = "log-quantidade-dietas-autorizadas-recreio-nas-ferias/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
