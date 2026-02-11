import React from "react";
import {
  TIPOS_SOLICITACAO_LABEL,
  TIPO_USUARIO,
} from "../../../constants/shared";
import "./style.scss";
import { existeLogDeCancelamentoDaEscola } from "./helper";
import { CODAE, DRE, ESCOLA } from "src/configs/constants";

export const RelatorioHistoricoJustificativaEscola = (props) => {
  const { solicitacao, visao, nomeEscola } = props;
  const EXIBIR_HISTORICO = existeLogDeCancelamentoDaEscola(solicitacao);
  let EXIBIR_HISTORICO_CANCELAMENTO_ESCOLA = false;
  let escolaQuantidade;

  if (solicitacao && visao === ESCOLA) {
    escolaQuantidade = solicitacao.escolas_quantidades.filter((eq) =>
      eq.escola.nome.includes(nomeEscola.replace(/"/g, "")),
    )[0];
    EXIBIR_HISTORICO_CANCELAMENTO_ESCOLA = escolaQuantidade.cancelado;
  }

  const foiCanceladoPelaDRE = (tipoUsuario) => {
    return tipoUsuario === "diretoriaregional";
  };

  const formataJustificativasDRE = (escolas_quantidades) => {
    let justificativasFormatadas = [];
    let arrayHorariosCancelados = [];
    escolas_quantidades.forEach((eq) =>
      arrayHorariosCancelados.push(eq.cancelado_em_com_hora),
    );
    let uniqueArrayHorarioCancelados = [...new Set(arrayHorariosCancelados)];
    uniqueArrayHorarioCancelados.forEach((dateTime) => {
      const [dateStr, timeStr] = dateTime.split(" ");
      const [month, day, year] = dateStr.split("/");
      const [hours, minutes, seconds] = timeStr.split(":");
      const date = new Date(
        +year,
        +month - 1,
        +day,
        +hours,
        +minutes,
        +seconds,
      );
      const isoString = date.toISOString();

      let unidades = [];
      let justificativa = "";
      let tipo_usuario = "";
      let nome_dre = "";
      let cancelado_por = "";
      escolas_quantidades
        .filter((eq) => eq.cancelado_em_com_hora === dateTime)
        .forEach((eq) => {
          unidades.push(eq.escola.nome);
          justificativa = eq.cancelado_justificativa;
          tipo_usuario = eq.cancelado_por.tipo_usuario;
          nome_dre = eq.escola.diretoria_regional.nome;
          cancelado_por = eq.cancelado_por.nome;
        });
      justificativasFormatadas.push({
        cancelado_em_com_hora: dateTime,
        data_para_ordenar: isoString,
        unidades: unidades,
        justificativa: justificativa,
        tipo_usuario: tipo_usuario,
        nome_dre: nome_dre,
        cancelado_por: cancelado_por,
      });
    });

    return justificativasFormatadas.sort(
      (a, b) => new Date(b.data_para_ordenar) - new Date(a.data_para_ordenar),
    );
  };

  return (
    <div>
      {solicitacao.tipo === TIPOS_SOLICITACAO_LABEL.SOLICITACAO_UNIFICADA ? (
        EXIBIR_HISTORICO_CANCELAMENTO_ESCOLA ? (
          <div className="question-history">
            <hr />
            <div className="row title">
              <div className="col-12">
                <p className="mb-2">Histórico de justificativas</p>
              </div>
            </div>
            {
              <div className="question-log">
                <div>
                  <p className="mb-2">
                    {escolaQuantidade.cancelado_em_com_hora} -{" "}
                    {foiCanceladoPelaDRE(
                      escolaQuantidade.cancelado_por.tipo_usuario,
                    )
                      ? "DRE"
                      : "UNIDADE"}{" "}
                    CANCELOU -{" "}
                    {foiCanceladoPelaDRE(
                      escolaQuantidade.cancelado_por.tipo_usuario,
                    )
                      ? escolaQuantidade.escola.diretoria_regional.nome
                      : "USUÁRIO " + escolaQuantidade.cancelado_por.nome}
                  </p>
                  <div className="is-it-possible">
                    {escolaQuantidade.cancelado_justificativa && (
                      <div className="obs mb-2 pt-0">
                        Observação do Cancelamento:{" "}
                        <b>{escolaQuantidade.cancelado_justificativa}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
          </div>
        ) : solicitacao.escolas_quantidades.some(
            (eq) => eq.cancelado && (visao === DRE || visao === CODAE),
          ) ? (
          <div className="question-history">
            <hr />
            <div className="row title">
              <div className="col-12">
                <p className="mb-2">Histórico de justificativas</p>
              </div>
            </div>
            {formataJustificativasDRE(
              solicitacao.escolas_quantidades.filter((eq) => eq.cancelado),
            ).map((item, key) => {
              return (
                <div className="question-log" key={key}>
                  <div>
                    <p className="mb-2">
                      {item.cancelado_em_com_hora} -{" "}
                      {foiCanceladoPelaDRE(item.tipo_usuario)
                        ? "DRE"
                        : "UNIDADE"}{" "}
                      CANCELOU -{" "}
                      {foiCanceladoPelaDRE(item.tipo_usuario)
                        ? item.nome_dre
                        : "USUÁRIO " + item.cancelado_por}
                    </p>
                    <div>
                      <p className="mt-1 mb-1">Unidades canceladas:</p>
                      {item.unidades.map((unidade, key) => {
                        return (
                          <p className="mb-0" key={key}>
                            {unidade}
                            <br />
                          </p>
                        );
                      })}
                    </div>
                    <div className="is-it-possible">
                      {item.justificativa && (
                        <div className="obs mb-4 pt-0">
                          Observação do Cancelamento:{" "}
                          <b>{item.justificativa}</b>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null
      ) : (
        EXIBIR_HISTORICO && (
          <div className="question-history">
            <hr />
            <div className="row title">
              <div className="col-12">
                <p>Histórico de justificativas</p>
              </div>
            </div>
            {solicitacao.logs.map((log, key) => {
              return log.status_evento_explicacao === "Escola cancelou" ? (
                <div key={key} className="question-log">
                  <div>
                    {log.criado_em} -{" "}
                    {log.usuario.tipo_usuario === TIPO_USUARIO.ESCOLA
                      ? "ESCOLA CANCELOU"
                      : "DRE CANCELOU"}
                    <div className="is-it-possible">
                      {log.justificativa && (
                        <div className="obs">
                          Observação do Cancelamento: {log.justificativa}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                log.status_evento_explicacao === "DRE cancelou" && (
                  <div key={key} className="question-log">
                    <div>
                      {log.criado_em} -{" "}
                      {log.usuario.tipo_usuario === TIPO_USUARIO.ESCOLA
                        ? "ESCOLA"
                        : "DRE"}
                      <div className="is-it-possible">
                        <div className="title">Cancelou</div>
                        {log.justificativa && (
                          <div className="obs">
                            Observação do Cancelamento: {log.justificativa}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default RelatorioHistoricoJustificativaEscola;
