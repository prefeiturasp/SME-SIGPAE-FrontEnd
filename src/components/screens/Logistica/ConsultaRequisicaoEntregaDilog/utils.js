import {
  toastSuccess,
  toastError,
  toastInfo,
} from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import {
  arquivaGuias,
  desarquivaGuias,
} from "../../../../services/logistica.service";
import { enviaSolicitacoesDaGrade } from "../../../../services/disponibilizacaoDeSolicitacoes.service";

export const exibeToastPeloStatus = (status, data) => {
  if (status === HTTP_STATUS.OK) {
    toastSuccess("Requisições de entrega enviadas com sucesso");
  } else if (status === HTTP_STATUS.BAD_REQUEST) {
    if (data.detail.includes("transição de estado")) {
      toastError("Erro de transição de estado");
    } else {
      toastError(data.detail);
    }
  } else if (status === HTTP_STATUS.PRECONDITION_REQUIRED) {
    toastInfo("Nenhuma requisição de entrega a enviar");
  } else {
    if (data.detail && data.detail.length > 0) {
      toastError(data.detail);
    } else {
      toastError("Erro do Servidor Interno");
    }
  }
};

export const confereSolicitacoesSelecionadas = (selecionados) => {
  return (
    selecionados.find(
      (selecionado) => selecionado.status !== "Aguardando envio",
    ) !== undefined || selecionados.length === 0
  );
};

export const arquivaDesarquivaGuias = async (
  selecionadas,
  numero_requisicao,
  situacao,
  atualizaTabela,
  setModal,
  setCarregando,
) => {
  setCarregando(true);
  let guias = selecionadas.map((x) => x.numero_guia);
  const payload = { guias, numero_requisicao };
  let textoToast =
    situacao === "ATIVA"
      ? "Guia(s) de Remessa arquivada(s) com sucesso"
      : "Guia(s) de Remessa desarquivada(s) com sucesso";
  let response =
    situacao === "ATIVA"
      ? await arquivaGuias(payload)
      : await desarquivaGuias(payload);
  if (response.status === HTTP_STATUS.OK) {
    atualizaTabela();
    toastSuccess(textoToast);
    setModal(false);
  } else {
    toastError("Erro ao arquivar a guia");
  }
  setCarregando(false);
};

export const enviarSolicitacoesMarcadas = async (
  selecionados,
  setCarregandoModal,
  atualizaTabela,
  setShowModal,
) => {
  setCarregandoModal(true);
  let payload = selecionados.map((x) => x.uuid);
  const response = await enviaSolicitacoesDaGrade(payload);
  if (response.status === HTTP_STATUS.OK && response.data.length === 0) {
    atualizaTabela();
    setShowModal(false);
    response.status = 428;
  } else if (response.status === HTTP_STATUS.OK && response.data.length > 0) {
    atualizaTabela();
    setShowModal(false);
  }
  setCarregandoModal(false);
  exibeToastPeloStatus(response.status, response.data);
};
