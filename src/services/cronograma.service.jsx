import axios from "./_base";
import { saveAs } from "file-saver";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "../components/Shareable/Toast/dialogs";

export const getEtapas = async () =>
  await axios.get("/cronogramas/opcoes-etapas/");

export const getCronograma = async (uuid) =>
  await axios.get(`/cronogramas/${uuid}/`);

export const getCronogramaDetalhar = async (uuid) =>
  await axios.get(`/cronogramas/${uuid}/detalhar-com-log/`);

export const cadastraCronograma = async (payload) =>
  await axios.post("/cronogramas/", payload);

export const editaCronograma = async (payload, uuid) =>
  await axios.put(`/cronogramas/${uuid}/`, payload);

export const getRascunhos = async () =>
  await axios.get("/cronogramas/rascunhos/");

export const getListagemCronogramas = async (params) => {
  const url = `/cronogramas/`;
  return await axios.get(url, { params });
};

export const getListagemRelatorioCronogramas = async (params) => {
  try {
    const response = await axios.get("/cronogramas/listagem-relatorio/", {
      params,
    });
    return response;
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
    throw error;
  }
};

export const getListaCronogramasPraCadastro = async () => {
  try {
    return await axios.get("/cronogramas/lista-cronogramas-cadastro/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const fornecedorAssinaCronograma = async (uuid, password) => {
  const url = `/cronogramas/${uuid}/fornecedor-assina-cronograma/`;
  return await axios.patch(url, {
    password: password,
  });
};

export const cadastraSolicitacaoAlteracaoCronograma = async (payload) => {
  return await axios.post("solicitacao-de-alteracao-de-cronograma/", payload);
};

export const dilogCienteSolicitacaoAlteracaoCronograma = async (
  uuid,
  payload,
) => {
  return await axios.patch(
    `solicitacao-de-alteracao-de-cronograma/${uuid}/cronograma-ciente/`,
    payload,
  );
};

export const analiseAbastecimentoSolicitacaoAlteracaoCronograma = async (
  uuid,
  payload,
) => {
  return await axios.patch(
    `solicitacao-de-alteracao-de-cronograma/${uuid}/analise-abastecimento/`,
    payload,
  );
};

export const analiseDilogSolicitacaoAlteracaoCronograma = async (
  uuid,
  payload,
) => {
  return await axios.patch(
    `solicitacao-de-alteracao-de-cronograma/${uuid}/analise-dilog/`,
    payload,
  );
};

export const getListagemSolicitacaoAlteracaoCronograma = async (params) => {
  const url = `/solicitacao-de-alteracao-de-cronograma/`;
  return await axios.get(url, { params });
};

export const getSolicitacaoAlteracaoCronograma = async (uuid) => {
  const url = `/solicitacao-de-alteracao-de-cronograma/${uuid}/`;
  return await axios.get(url);
};

export const cronogramaAssina = async (uuid, password) => {
  const url = `/cronogramas/${uuid}/cronograma-assina/`;
  return await axios.patch(url, {
    password: password,
  });
};

export const abastecimentoAssinaCronograma = async (uuid, password) => {
  const url = `/cronogramas/${uuid}/abastecimento-assina/`;
  return await axios.patch(url, {
    password: password,
  });
};

export const codaeAssinaCronograma = async (uuid, password) => {
  const url = `/cronogramas/${uuid}/codae-assina/`;
  return await axios.patch(url, {
    password: password,
  });
};

export const fornecedorCienteAlteracaoCodae = async (uuid) => {
  return await axios.patch(
    `solicitacao-de-alteracao-de-cronograma/${uuid}/fornecedor-ciente/`,
  );
};

export const getDashboardCronograma = async (params = null) =>
  await axios.get(`/cronogramas/dashboard/`, { params });

export const getDashboardCronogramaComFiltros = async (params) =>
  await axios.get(`/cronogramas/dashboard-com-filtro/`, { params });

export const getDashboardSolicitacoesAlteracao = async (params = null) =>
  await axios.get(`/solicitacao-de-alteracao-de-cronograma/dashboard/`, {
    params,
  });

export const getDashboardSolicitacoesAlteracaoComFiltros = async (
  params = null,
) =>
  await axios.get(
    `/solicitacao-de-alteracao-de-cronograma/dashboard-com-filtro/`,
    {
      params,
    },
  );

export const imprimirCronograma = async (uuid, numero) => {
  const url = `/cronogramas/${uuid}/gerar-pdf-cronograma/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "cronograma_" + numero + ".pdf");
};

export const getUnidadesDeMedidaLogistica = async () => {
  return await axios.get(`/unidades-medida-logistica/lista-nomes-abreviacoes/`);
};

export const getCalendarioCronogramas = async (params) => {
  try {
    return await axios.get("/calendario-cronogramas/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const getListaCronogramasPraFichaRecebimento = async () => {
  try {
    return await axios.get("/cronogramas/lista-cronogramas-ficha-recebimento/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const getCronogramaPraCadastroRecebimento = async (uuid) => {
  try {
    return await axios.get(
      `/cronogramas/${uuid}/dados-cronograma-ficha-recebimento/`,
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const baixarRelatorioCronogramasExcel = async (params) =>
  await axios.get("/cronogramas/gerar-relatorio-xlsx-async/", {
    params,
  });

export const baixarRelatorioCronogramasPdf = async (params) =>
  await axios.get("/cronogramas/gerar-relatorio-pdf-async/", {
    params,
  });

// Interrupção Programada de Entregas
export const getMotivosInterrupcao = async () =>
  await axios.get("/interrupcao-programada-entrega/motivos/");

export const getInterrupcoesProgramadas = async (params) => {
  try {
    return await axios.get("/interrupcao-programada-entrega/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const cadastraInterrupcaoProgramada = async (payload) =>
  await axios.post("/interrupcao-programada-entrega/", payload);
