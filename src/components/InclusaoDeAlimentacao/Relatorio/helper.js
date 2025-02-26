import { CODAE, DRE, TERCEIRIZADA } from "configs/constants";
import { statusEnum, TIPO_PERFIL } from "constants/shared";

const tipoPerfil = localStorage.getItem("tipo_perfil");

export const exibeBotaoNaoAprovar = (
  inclusaoDeAlimentacao,
  textoBotaoNaoAprova
) => {
  return (
    tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA ||
    (inclusaoDeAlimentacao &&
      inclusaoDeAlimentacao.prioridade !== "REGULAR" &&
      inclusaoDeAlimentacao.status === statusEnum.CODAE_QUESTIONADO &&
      textoBotaoNaoAprova)
  );
};

export const exibeBotaoAprovar = (
  inclusaoDeAlimentacao,
  visao,
  textoBotaoAprova
) => {
  if (!textoBotaoAprova || !inclusaoDeAlimentacao) return false;
  return (
    (![
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) ||
      inclusaoDeAlimentacao.prioridade === "REGULAR" ||
      [
        statusEnum.TERCEIRIZADA_RESPONDEU_QUESTIONAMENTO,
        statusEnum.CODAE_AUTORIZADO,
      ].includes(inclusaoDeAlimentacao.status)) &&
    textoBotaoAprova !== "Ciente" &&
    (visao === DRE ||
      (visao === CODAE &&
        (inclusaoDeAlimentacao.prioridade === "REGULAR" ||
          inclusaoDeAlimentacao.logs.find(
            (log) =>
              log.status_evento_explicacao ===
                "Terceirizada respondeu questionamento" && log.resposta_sim_nao
          ))))
  );
};

export const exibirBotaoQuestionamento = (inclusaoDeAlimentacao, visao) => {
  return (
    [
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.TERCEIRIZADA,
    ].includes(tipoPerfil) &&
    inclusaoDeAlimentacao &&
    (inclusaoDeAlimentacao.prioridade !== "REGULAR" ||
      (visao === CODAE && inclusaoDeAlimentacao.prioridade !== "REGULAR")) &&
    [statusEnum.DRE_VALIDADO, statusEnum.CODAE_QUESTIONADO].includes(
      inclusaoDeAlimentacao.status
    )
  );
};

export const exibirModalAutorizacaoAposQuestionamento = (
  inclusaoDeAlimentacao,
  visao
) => {
  return (
    visao === CODAE &&
    inclusaoDeAlimentacao &&
    inclusaoDeAlimentacao.prioridade !== "REGULAR" &&
    !inclusaoDeAlimentacao.logs[inclusaoDeAlimentacao.logs.length - 1]
      .resposta_sim_nao
  );
};
export const exibirBotaoMarcarConferencia = (inclusaoDeAlimentacao, visao) => {
  return (
    visao === TERCEIRIZADA &&
    inclusaoDeAlimentacao &&
    [statusEnum.CODAE_AUTORIZADO, statusEnum.ESCOLA_CANCELOU].includes(
      inclusaoDeAlimentacao.status
    )
  );
};
