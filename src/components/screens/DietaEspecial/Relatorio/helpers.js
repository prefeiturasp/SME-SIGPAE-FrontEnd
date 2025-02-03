import { statusEnum } from "constants/shared";
import { createSolicitacaoAberta } from "services/dietaEspecial.service";
import HTTP_STATUS from "http-status-codes";
import { deleteSolicitacaoAberta } from "../../../../services/dietaEspecial.service";
import { Websocket } from "services/websocket";

const DESCRICAO_SOLICITACAO = {
  CODAE_A_AUTORIZAR: "Solicitação de Inclusão",
  CODAE_NEGOU_PEDIDO: "Negada a Inclusão",
  CODAE_AUTORIZADO: "Autorizada",
  ESCOLA_SOLICITOU_INATIVACAO: "Solicitação de Cancelamento",
  CODAE_NEGOU_INATIVACAO: "Negado o Cancelamento",
  CODAE_AUTORIZOU_INATIVACAO: "Cancelamento Autorizado",
  ESCOLA_CANCELOU: "Cancelada pela Unidade Educacional",
  TERMINADA_AUTOMATICAMENTE_SISTEMA:
    "Cancelamento automático por atingir data de término",
  CANCELADO_ALUNO_MUDOU_ESCOLA:
    "Cancelamento para aluno não matriculado na Unidade Educacional",
  CANCELADO_ALUNO_NAO_PERTENCE_REDE:
    "Cancelamento para aluno não matriculado na rede municipal",
  CODAE_NEGOU_CANCELAMENTO: "Negado o Cancelamento",
};

export const cabecalhoDieta = (dietaEspecial, card) => {
  let descricao = null;
  if (card && ["inativas", "inativo"].includes(card)) {
    descricao = "Inativa";
  } else if (card && card === "inativas-temp") {
    descricao = "Inativa Temporariamente";
  } else if (card && card === "autorizadas-temp") {
    descricao = "Autorizada Temporariamente";
  } else if (
    dietaEspecial.status_solicitacao === "CODAE_A_AUTORIZAR" &&
    dietaEspecial.tipo_solicitacao === "ALTERACAO_UE"
  ) {
    descricao = "Solicitação de Alteração de U.E";
  } else if (
    dietaEspecial.status_solicitacao === "CODAE_NEGOU_PEDIDO" &&
    dietaEspecial.tipo_solicitacao === "ALTERACAO_UE"
  ) {
    descricao = "Negada Alteração de UE";
  } else {
    descricao = DESCRICAO_SOLICITACAO[dietaEspecial.status_solicitacao];
  }

  return `Dieta Especial - ${descricao}`;
};

export const ehSolicitacaoDeCancelamento = (status) => {
  return [
    "ESCOLA_CANCELOU",
    "TERMINADA_AUTOMATICAMENTE_SISTEMA",
    "CANCELADO_ALUNO_MUDOU_ESCOLA",
    "CANCELADO_ALUNO_NAO_PERTENCE_REDE",
  ].includes(status);
};

export const formataJustificativa = (dietaEspecial) => {
  let justificativa = null;
  if (dietaEspecial.status_solicitacao === "ESCOLA_CANCELOU") {
    const log = dietaEspecial.logs.find(
      (l) => l.status_evento_explicacao === "Escola cancelou"
    );
    if (log) {
      justificativa = log.justificativa;
    }
  }
  if (
    ["ESCOLA_SOLICITOU_INATIVACAO", "CODAE_NEGOU_CANCELAMENTO"].includes(
      dietaEspecial.status_solicitacao
    )
  ) {
    justificativa = dietaEspecial.logs.filter(
      (log) => log.status_evento_explicacao === "Escola solicitou cancelamento"
    )[0].justificativa;
  }
  if (
    dietaEspecial.status_solicitacao === "TERMINADA_AUTOMATICAMENTE_SISTEMA"
  ) {
    justificativa = "Cancelamento automático por atingir data de término.";
  }
  if (
    dietaEspecial.status_solicitacao === "CANCELADO_ALUNO_NAO_PERTENCE_REDE"
  ) {
    justificativa =
      "Cancelamento automático para aluno não matriculado na rede municipal.";
  }
  if (dietaEspecial.status_solicitacao === "CANCELADO_ALUNO_MUDOU_ESCOLA") {
    justificativa =
      "Cancelamento automático para aluno não matriculado na Unidade Educacional.";
  }
  return justificativa;
};

export const mostrarFormulário = (status) => {
  return [
    "ESCOLA_CANCELOU",
    "TERMINADA_AUTOMATICAMENTE_SISTEMA",
    "CANCELADO_ALUNO_MUDOU_ESCOLA",
    "CANCELADO_ALUNO_NAO_PERTENCE_REDE",
    "CODAE_A_AUTORIZAR",
  ].includes(status);
};

export const mostrarFormUsuarioEscola = (perfil, dieta) => {
  const tipoUsuario = localStorage.getItem("tipo_perfil");
  if (
    tipoUsuario === perfil &&
    dieta.status_solicitacao === "CODAE_A_AUTORIZAR"
  ) {
    return false;
  } else {
    return true;
  }
};

export const ehCanceladaSegundoStep = (dieta) => {
  if (
    dieta.logs.length === 2 &&
    dieta.logs[1].status_evento_explicacao === "Escola cancelou"
  ) {
    return true;
  } else {
    return false;
  }
};
// (dietaEspecial && dietaEspecial.logs.length === 2 && status === "ESCOLA_CANCELOU")? true : false;

export const solicitacaoEhDoCardAutorizadas = (status) => {
  return [
    statusEnum.CODAE_AUTORIZADO,
    statusEnum.TERCEIRIZADA_TOMOU_CIENCIA,
    statusEnum.CODAE_AUTORIZOU_INATIVACAO,
    statusEnum.TERCEIRIZADA_TOMOU_CIENCIA_INATIVACAO,
  ].includes(status);
};

export const ehAlunoNaoMatriculado = (tipoSolicitacao) => {
  return tipoSolicitacao === "ALUNO_NAO_MATRICULADO";
};

export const setDadosDietaAbertaAsync = async (
  uuid_solicitacao,
  setDadosDietaAberta
) => {
  const response = await createSolicitacaoAberta({ uuid_solicitacao });
  if (response.status === HTTP_STATUS.CREATED) {
    setDadosDietaAberta(response.data);
  }
};

const fetchData = async (uuid, setDadosDietaAberta) => {
  const payload = {
    uuid_solicitacao: uuid,
  };
  const response = await createSolicitacaoAberta(payload);
  if (response.status === HTTP_STATUS.CREATED) {
    setDadosDietaAberta(response.data);
  }
};

const onClose = (
  uuid,
  dadosDietaAberta,
  setDadosDietaAberta,
  setUuidDieta,
  setDietasAbertas
) => {
  if (dadosDietaAberta) {
    deleteSolicitacaoAberta(dadosDietaAberta.id);
  }
  initSocket(uuid, setDadosDietaAberta, setUuidDieta, setDietasAbertas);
};

const onOpen = (uuid, setDadosDietaAberta, setUuidDieta) => {
  if (uuid) {
    fetchData(uuid, setDadosDietaAberta);
    setUuidDieta(uuid);
  }
};

export const initSocket = (
  uuid,
  dadosDietaAberta,
  setDadosDietaAberta,
  setUuidDieta,
  setDietasAbertas
) => {
  return new Websocket(
    "solicitacoes-abertas/",
    ({ data }) => {
      data && setDietasAbertas(JSON.parse(data).message);
    },
    () =>
      onClose(
        uuid,
        dadosDietaAberta,
        setDadosDietaAberta,
        setUuidDieta,
        setDietasAbertas
      ),
    () => onOpen(uuid, setDadosDietaAberta, setUuidDieta)
  );
};
