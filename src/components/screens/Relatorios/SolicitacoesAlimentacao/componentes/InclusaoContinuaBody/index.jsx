import { WEEK } from "src/configs/constants";
import React, { useState } from "react";
import { HistoricoAlteracao } from "src/components/InclusaoDeAlimentacao/Relatorio/componentes/HistoricoAlteracao";

export const InclusaoContinuaBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);
  const quantidadesPeriodo = solicitacao.quantidades_periodo || [];
  const encerradoDates = quantidadesPeriodo
    .map((quantidadePeriodo) => quantidadePeriodo.encerrado_a_partir_de)
    .filter(Boolean);
  const todasEncerradaMesmaData =
    encerradoDates.length > 0 &&
    encerradoDates.length === quantidadesPeriodo.length &&
    encerradoDates.every(
      (encerradoDate) => encerradoDate === encerradoDates[0],
    );
  const exibeColunaEncerramento =
    encerradoDates.length > 0 && !todasEncerradaMesmaData;
  const dataEncerramentoComum = todasEncerradaMesmaData
    ? encerradoDates[0]
    : null;
  const tamanhoColunaPeriodo = exibeColunaEncerramento ? "col-2" : "col-3";
  const tamanhoColunaAlunos = exibeColunaEncerramento ? "col-2" : "col-3";
  const exibeHistoricoAlteracao =
    encerradoDates.length > 0 &&
    (solicitacao.logs || []).some(
      (itemLog) => itemLog.status_evento_explicacao === "Escola alterou",
    );

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
                    {solicitacao.data_inicial} -{" "}
                    {todasEncerradaMesmaData ? (
                      <>
                        <s>{solicitacao.data_final}</s>{" "}
                        <span className="color-red">
                          {dataEncerramentoComum}
                        </span>
                      </>
                    ) : (
                      solicitacao.data_final
                    )}
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
              <div className={tamanhoColunaPeriodo}>
                <p>Período:</p>
              </div>
              <div className="col-3">
                <p>Tipos de Alimentação:</p>
              </div>
              <div className={tamanhoColunaAlunos}>
                <p>No de Alunos:</p>
              </div>
              {exibeColunaEncerramento && (
                <div className="col-2">
                  <p>Encerrado a partir de:</p>
                </div>
              )}
            </div>
            {quantidadesPeriodo.map((quantidade_periodo, idx) => {
              const tiposAlimentacao = quantidade_periodo.tipos_alimentacao
                .map((tipo_alimentacao) => tipo_alimentacao.nome)
                .join(", ");
              const linhaCancelada =
                quantidade_periodo.cancelado ||
                quantidade_periodo.encerrado_a_partir_de ||
                solicitacao.status === "ESCOLA_CANCELOU";
              return (
                <div
                  className={`row ${linhaCancelada ? "cancelado" : ""}`}
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
                  <div
                    className={`${tamanhoColunaPeriodo} nome-periodo-escolar-relatorio-sol-alim`}
                  >
                    <p>
                      <b>{quantidade_periodo.periodo_escolar.nome}</b>
                    </p>
                  </div>
                  <div className="col-3 tipos-alimentacao-relatorio-sol-alim">
                    <p>
                      <b>{tiposAlimentacao}</b>
                    </p>
                  </div>
                  <div
                    className={`${tamanhoColunaAlunos} numero-alunos-relatorio-sol-alim`}
                  >
                    <p>
                      <b>{quantidade_periodo.numero_alunos}</b>
                    </p>
                  </div>
                  {exibeColunaEncerramento && (
                    <div className="col-2 encerrado-a-partir-relatorio-sol-alim">
                      <p>
                        <b className="color-red">
                          {quantidade_periodo.encerrado_a_partir_de}
                        </b>
                      </p>
                    </div>
                  )}
                  {quantidade_periodo.observacao !== "<p></p>" && (
                    <div className="col-12 observacao-relatorio-sol-alim">
                      <p>Observação:</p>
                      <div
                        className="value fw-bold"
                        dangerouslySetInnerHTML={{
                          __html: quantidade_periodo.observacao,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {quantidadesPeriodo.find(
              (quantidadePeriodo) => quantidadePeriodo.cancelado,
            ) && (
              <>
                <hr />
                <div>
                  <strong>Histórico de cancelamento</strong>
                  {quantidadesPeriodo
                    .filter((quantidadePeriodo) => quantidadePeriodo.cancelado)
                    .map((quantidadePeriodo, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {quantidadePeriodo.data ||
                            `${
                              quantidadePeriodo.periodo_escolar.nome
                            } - ${quantidadePeriodo.tipos_alimentacao
                              .map((ta) => ta.nome)
                              .join(", ")} - ${
                              quantidadePeriodo.numero_alunos
                            }`}
                          {" - "}
                          justificativa:{" "}
                          {quantidadePeriodo.cancelado_justificativa}
                        </div>
                      );
                    })}
                </div>
              </>
            )}
            {exibeHistoricoAlteracao && (
              <HistoricoAlteracao inclusaoDeAlimentacao={solicitacao} />
            )}
          </div>
        </td>
      </tr>
    ),
  ];
};
