import { CODAE, DRE, TERCEIRIZADA } from "src/configs/constants";
import { statusEnum, TIPO_PERFIL } from "src/constants/shared";

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

const ehLancheEmergencial = (solicitacao, visao) => {
  return (
    visao === CODAE &&
    solicitacao.status === statusEnum.DRE_VALIDADO &&
    tipoPerfil === TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA &&
    solicitacao.motivo?.nome === "Lanche Emergencial"
  );
};

export const exibeBotaoAprovar = (solicitacao, visao, textoBotaoAprova) => {
  if (!textoBotaoAprova || !solicitacao) return false;
  if (ehLancheEmergencial(solicitacao, visao)) return true;
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
  if (ehLancheEmergencial(solicitacao, visao)) return false;
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
  if (ehLancheEmergencial(solicitacao, visao)) return false;
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
