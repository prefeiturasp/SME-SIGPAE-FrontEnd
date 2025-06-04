import React from "react";
import { Collapse } from "react-collapse";

import "./style.scss";

import { WEEK } from "src/configs/constants";

export const SolicitacoesSimilaresInclusaoNormal = ({ ...props }) => {
  const { solicitacao, index } = props;

  const ehInclusaoContinuaENaoETEC = (quantidade_por_periodo) => {
    return (
      quantidade_por_periodo.inclusao_alimentacao_continua !== null &&
      solicitacao.motivo.nome !== "ETEC"
    );
  };

  const possuiAlgumaInclusaoContinuaNaoETEC =
    solicitacao.quantidades_periodo.some((qp) =>
      ehInclusaoContinuaENaoETEC(qp)
    );

  const renderDataSolicitacao = (solicitacao) => {
    if (solicitacao.data_inicial && solicitacao.data_final) {
      return (
        <>
          <div className="col-2">
            <p>DE:</p>
            <p>
              <b>{solicitacao.data_inicial}</b>
            </p>
          </div>
          <div className="col-2">
            <p>ATÉ:</p>
            <p>
              <b>{solicitacao.data_final}</b>
            </p>
          </div>
        </>
      );
    }
    return (
      <div className="col-4">
        <p>Dia(s) de inclusão:</p>
        <p>
          {solicitacao.inclusoes?.map((inclusao, index) => (
            <b className="me-4" key={index}>
              {inclusao.data}
            </b>
          ))}
        </p>
      </div>
    );
  };

  return (
    <Collapse isOpened={solicitacao.collapsed} key={index}>
      <tr className="row solicitacao-similar-info">
        <td className="col-12 remove-padding">
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-4">
                <p>Solicitação Número:</p>
                <p>
                  <b>{`#${solicitacao.id_externo}`}</b>
                </p>
              </div>
              <div className="col-4">
                <p>Data da Inclusão:</p>
                <p>
                  <b>
                    {solicitacao.logs &&
                      solicitacao.logs.length > 0 &&
                      solicitacao.logs[0].criado_em.split(" ")[0]}
                  </b>
                </p>
              </div>
              <div className="col-4">
                <p>Status da Solicitação:</p>
                <p>
                  <b>
                    {solicitacao.logs &&
                      solicitacao.logs.length > 0 &&
                      solicitacao.logs[solicitacao.logs.length - 1]
                        .status_evento_explicacao}
                  </b>
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-4">
                <p>Motivo:</p>
                <p>
                  <b>
                    {solicitacao.motivo?.nome ||
                      solicitacao.inclusoes[0].motivo.nome}
                  </b>
                </p>
              </div>
              {renderDataSolicitacao(solicitacao)}
            </div>
            <div>
              <table className="periodos-emef mt-3">
                <thead>
                  <tr className="row bg-black">
                    {possuiAlgumaInclusaoContinuaNaoETEC && (
                      <th className="col-2 text-white">
                        <b>Repetir</b>
                      </th>
                    )}
                    <th className="col-2 text-white">
                      <b>Período</b>
                    </th>
                    <th
                      className={
                        possuiAlgumaInclusaoContinuaNaoETEC
                          ? "col-6 text-white"
                          : "col-8 text-white"
                      }
                    >
                      <b>Tipos de Alimentação</b>
                    </th>
                    <th className="col-2 text-white text-center">
                      <b>Nº de Alunos</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacao.quantidades_periodo.map(
                    (quantidade_por_periodo, idx) => {
                      return (
                        <tr className="row bg-white" key={idx}>
                          {ehInclusaoContinuaENaoETEC(
                            quantidade_por_periodo
                          ) && (
                            <td className="col-2 weekly">
                              {WEEK.map((day, key) => {
                                return (
                                  <span
                                    key={key}
                                    className={
                                      quantidade_por_periodo.dias_semana
                                        .map(String)
                                        .includes(day.value)
                                        ? "week-circle-clicked green"
                                        : "week-circle"
                                    }
                                    data-cy={`dia-${key}`}
                                    value={day.value}
                                  >
                                    {day.label}
                                  </span>
                                );
                              })}
                            </td>
                          )}
                          <td className="col-2">
                            <p>{quantidade_por_periodo.periodo_escolar.nome}</p>
                          </td>
                          <td
                            className={
                              possuiAlgumaInclusaoContinuaNaoETEC
                                ? "col-6"
                                : "col-8"
                            }
                          >
                            <p>
                              {quantidade_por_periodo.tipos_alimentacao.reduce(
                                (acc, tipo, idxTipo) =>
                                  acc +
                                  tipo.nome +
                                  (idxTipo !==
                                  quantidade_por_periodo.tipos_alimentacao
                                    .length -
                                    1
                                    ? ", "
                                    : ""),
                                ""
                              )}
                            </p>
                          </td>
                          <td className="col-2 text-center">
                            <p>{quantidade_por_periodo.numero_alunos}</p>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <p>Observações:</p>
                <p
                  className="value-black"
                  dangerouslySetInnerHTML={{
                    __html:
                      solicitacao.quantidades_periodo[0].observacao || "-",
                  }}
                />
              </div>
            </div>
          </div>
        </td>
      </tr>
    </Collapse>
  );
};
