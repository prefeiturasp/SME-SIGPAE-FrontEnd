import React from "react";
import {
  existeAlgumStatusFimDeFluxo,
  tipoDeStatusClasse,
  formatarLogs,
} from "./helper";
import "./style.scss";
import { deepCopy } from "../../../helpers/utilities";
import { TIPO_PERFIL } from "../../../constants/shared";

export const FluxoDeStatus = (props) => {
  const {
    listaDeStatus,
    fluxo,
    eh_gestao_alimentacao = false,
    eh_medicao_inicial = false,
    eh_dieta_especial = false,
  } = props;
  let cloneListaDeStatus = deepCopy(listaDeStatus);
  cloneListaDeStatus = formatarLogs(cloneListaDeStatus);
  const fluxoNaoFinalizado =
    cloneListaDeStatus && existeAlgumStatusFimDeFluxo(cloneListaDeStatus);
  let fluxoUtilizado =
    fluxo.length > cloneListaDeStatus.length ? fluxo : cloneListaDeStatus;
  let ultimoStatus = cloneListaDeStatus.slice(-1)[0];
  let temStatusDeAnaliseSensorialCancelada = false;

  if (eh_medicao_inicial && !listaDeStatus.length) {
    fluxoUtilizado = fluxo;
  }

  if (
    cloneListaDeStatus.length > fluxo.length &&
    ultimoStatus.status_evento_explicacao === "Solicitação Realizada"
  ) {
    fluxoUtilizado.push({
      status_evento_explicacao: "CODAE",
      status: "",
      criado_em: "",
      usuario: null,
    });
    temStatusDeAnaliseSensorialCancelada = true;
  }

  const fluxoUtilizadoEFormatado = fluxoUtilizado.map((log) => {
    let logFormatado = log;
    if (log.status_evento_explicacao === "Escola solicitou cancelamento") {
      logFormatado = "Escola solicitou cancelamento";
    }
    if (
      log.status_evento_explicacao === "Escola cancelou" &&
      !eh_gestao_alimentacao
    ) {
      logFormatado = "CODAE autorizou cancelamento";
    }
    return logFormatado;
  });

  const getTitulo = (log) => {
    if (log) {
      if (
        log.justificativa &&
        log.justificativa === "A solicitação não foi validada em tempo hábil"
      ) {
        return log.justificativa;
      } else {
        if (log.status_evento_explicacao === "Escola solicitou cancelamento") {
          return "Escola solicitou cancelamento";
        }
        if (
          log.status_evento_explicacao === "Escola cancelou" &&
          log.usuario.tipo_usuario === "escola"
        ) {
          return "Escola cancelou";
        }
        if (
          log.status_evento_explicacao === "Escola cancelou" &&
          !eh_gestao_alimentacao
        ) {
          return "CODAE autorizou cancelamento";
        }
        if (log.status_evento_explicacao === "Correção solicitada") {
          return "Devolvido para ajustes pela DRE";
        }
        if (log.status_evento_explicacao === "Correção solicitada pela CODAE") {
          return "Devolvido para ajustes pela CODAE";
        }
        return log.status_evento_explicacao;
      }
    }
  };

  const RFouCPF = (key, novoStatus) => {
    return cloneListaDeStatus[key].usuario.tipo_usuario === "terceirizada"
      ? `CPF: ${novoStatus.usuario.cpf}`
      : novoStatus.usuario.registro_funcional
      ? `RF: ${novoStatus.usuario.registro_funcional || "sem RF"}`
      : "";
  };

  const tipoPerfil = localStorage.getItem("tipo_perfil");

  return (
    <div className="w-100">
      <ul
        className={`progressbar-titles fluxos`}
        data-testid="progressbar-titles"
      >
        {fluxoUtilizadoEFormatado.map((status, key) => {
          return (
            <li key={key}>
              {cloneListaDeStatus[key]
                ? getTitulo(cloneListaDeStatus[key])
                : status.titulo}
            </li>
          );
        })}
      </ul>
      <ul className="progressbar" data-testid="progressbar">
        {fluxoUtilizadoEFormatado.map((status, key) => {
          let novoStatus = cloneListaDeStatus[key] || status;
          return (
            <li
              key={key}
              className={`${
                tipoDeStatusClasse(novoStatus) !== "pending"
                  ? tipoDeStatusClasse(novoStatus)
                  : fluxoNaoFinalizado || temStatusDeAnaliseSensorialCancelada
                  ? "pending"
                  : ""
              }`}
              style={{ width: 100 / fluxoUtilizadoEFormatado.length + "%" }}
            >
              {novoStatus.criado_em}
              <br />
              {!(
                eh_dieta_especial &&
                status.status_evento_explicacao === "CODAE negou" &&
                [
                  TIPO_PERFIL.ESCOLA,
                  TIPO_PERFIL.DIRETORIA_REGIONAL,
                  TIPO_PERFIL.TERCEIRIZADA,
                  TIPO_PERFIL.SUPERVISAO_NUTRICAO,
                  TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
                  TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
                  TIPO_PERFIL.CODAE_GABINETE,
                ].includes(tipoPerfil)
              ) &&
                novoStatus.usuario && (
                  <span>
                    {RFouCPF(key, novoStatus)}
                    {RFouCPF(key, novoStatus) && <br />}
                    {novoStatus.usuario && novoStatus.usuario.nome}
                  </span>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
