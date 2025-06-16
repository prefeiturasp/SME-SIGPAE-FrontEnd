import { WEEK } from "src/configs/constants";
import React, { useState } from "react";

export const InclusaoContinuaBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  return [
    <tr className="table-body-items" key={index}>
      <td>
        {item.dre_iniciais} - {item.lote_nome}
      </td>
      {filtros.status && filtros.status === "RECEBIDAS" ? (
        <td>{item.terceirizada_nome}</td>
      ) : (
        <td>{item.escola_nome}</td>
      )}
      <td>{item.desc_doc}</td>
      <td className="text-center">
        {solicitacao.data_inicial} - {solicitacao.data_final}
      </td>
      <td className="text-center">
        {item.numero_alunos !== 0 ? item.numero_alunos : "-"}
      </td>
      <td className="text-center">
        <i
          className={`fas fa-${showDetail ? "angle-up" : "angle-down"}`}
          onClick={() => setShowDetail(!showDetail)}
        />
      </td>
    </tr>,
    showDetail && (
      <tr key={item.uuid}>
        <td colSpan={6}>
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-3">
                <p>ID da Solicitação:</p>
                <p>
                  <b># {solicitacao.id_externo}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Motivo:</p>
                <p>
                  <b>{solicitacao.motivo.nome}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Período de Inclusão:</p>
                <p>
                  <b>
                    {solicitacao.data_inicial} - {solicitacao.data_final}
                  </b>
                </p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            <div className="row mt-3">
              {solicitacao.motivo.nome !== "ETEC" && (
                <div className="col-3">
                  <p>Repetir:</p>
                </div>
              )}
              <div className="col-3">
                <p>Período:</p>
              </div>
              <div className="col-3">
                <p>Tipos de Alimentação:</p>
              </div>
              <div className="col-3">
                <p>No de Alunos:</p>
              </div>
            </div>
            {solicitacao.quantidades_periodo.map((quantidade_periodo, idx) => {
              const tiposAlimentacao = quantidade_periodo.tipos_alimentacao
                .map((tipo_alimentacao) => tipo_alimentacao.nome)
                .join(", ");
              return (
                <div
                  className={`row ${
                    quantidade_periodo.cancelado ||
                    solicitacao.status === "ESCOLA_CANCELOU"
                      ? "cancelado"
                      : ""
                  }`}
                  key={idx}
                >
                  {solicitacao.motivo.nome !== "ETEC" && (
                    <div className="col-3 weekly">
                      {WEEK.map((day, key) => {
                        return (
                          <span
                            key={key}
                            className={
                              quantidade_periodo.dias_semana
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
                    </div>
                  )}
                  <div className="col-3 nome-periodo-escolar-relatorio-sol-alim">
                    <p>
                      <b>{quantidade_periodo.periodo_escolar.nome}</b>
                    </p>
                  </div>
                  <div className="col-3 tipos-alimentacao-relatorio-sol-alim">
                    <p>
                      <b>{tiposAlimentacao}</b>
                    </p>
                  </div>
                  <div className="col-3 numero-alunos-relatorio-sol-alim">
                    <p>
                      <b>{quantidade_periodo.numero_alunos}</b>
                    </p>
                  </div>
                  {quantidade_periodo.observacao !== "<p></p>" && (
                    <div className="col-12 observacao-relatorio-sol-alim">
                      <p>Observação:</p>
                      <b>
                        <p
                          className="value"
                          dangerouslySetInnerHTML={{
                            __html: quantidade_periodo.observacao,
                          }}
                        />
                      </b>
                    </div>
                  )}
                </div>
              );
            })}
            {solicitacao.quantidades_periodo.find(
              (quantidades_periodo) =>
                quantidades_periodo.cancelado_justificativa
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.quantidades_periodo
                    .filter(
                      (quantidades_periodo) =>
                        quantidades_periodo.cancelado_justificativa
                    )
                    .map((quantidades_periodo, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {quantidades_periodo.data ||
                            `${
                              quantidades_periodo.periodo_escolar.nome
                            } - ${quantidades_periodo.tipos_alimentacao
                              .map((ta) => ta.nome)
                              .join(", ")} - ${
                              quantidades_periodo.numero_alunos
                            }`}
                          {" - "}
                          justificativa:{" "}
                          {quantidades_periodo.cancelado_justificativa}
                        </div>
                      );
                    })}
                </p>
              </>
            )}
          </div>
        </td>
      </tr>
    ),
  ];
};
