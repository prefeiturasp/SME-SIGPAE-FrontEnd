import { CODAE, DRE, TERCEIRIZADA } from "configs/constants";
import { statusEnum, TIPO_PERFIL } from "constants/shared";

const tipoPerfil = localStorage.getItem("tipo_perfil");

export const exibeBotaoNaoAprovar = (solicitacao, textoBotaoNaoAprova) => {
  return (
    tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
    (solicitacao &&
      solicitacao.prioridade !== "REGULAR" &&
      solicitacao.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova)
  );
};

export const exibeBotaoAprovar = (solicitacao, visao, textoBotaoAprova) => {
  if (!textoBotaoAprova || !solicitacao) return false;
  return (
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) ||
      solicitacao.prioridade === "REGULAR" ||
      [
        statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
        statusEnum.CODAE_AUTORIZADO,
      ].includes(solicitacao.status)) &&
    textoBotaoAprova !== "Ciente" &&
    (visao === DRE ||
      (visao === CODAE &&
        (solicitacao.prioridade === "REGULAR" ||
          solicitacao.logs.find(
            (log) =>
              log.status_evento_explicacao ===
                "Terceirizada respondeu questionamento" && log.resposta_sim_nao
          ))))
  );
};

export const exibirBotaoQuestionamento = (
  solicitacao,
  visao,
  tipoPerfil_ = tipoPerfil
) => {
  return (
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil_) &&
    solicitacao &&
    (solicitacao.prioridade !== "REGULAR" ||
      (visao === CODAE && solicitacao.prioridade !== "REGULAR")) &&
    [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
      solicitacao.status
    )
  );
};

export const exibirModalAutorizacaoAposQuestionamento = (
  solicitacao,
  visao
) => {
  return (
    visao === CODAE &&
    solicitacao &&
    solicitacao.prioridade !== "REGULAR" &&
    !solicitacao.logs[solicitacao.logs.length - 1].resposta_sim_nao
  );
};
export const exibirBotaoMarcarConferencia = (solicitacao, visao) => {
  return (
    visao === TERCEIRIZADA &&
    solicitacao &&
    [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
      solicitacao.status
    )
  );
};
