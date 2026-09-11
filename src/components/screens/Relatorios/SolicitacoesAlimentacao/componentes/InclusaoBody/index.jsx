import React, { useState } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export const InclusaoBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  const ehDiaCancelado = (inclusao) => {
    return inclusao.cancelado || solicitacao.status === "ESCOLA_CANCELOU"
      ? "dia-cancelado"
      : "";
  };

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
      <td className="text-center">{solicitacao.datas}</td>
      <td className="text-center">
        {item.numero_alunos !== 0 ? item.numero_alunos : "-"}
      </td>
      <td className="text-center">
        <i
          className={`fas fa-${showDetail ? "angle-up" : "angle-down"}`}
          role="button"
          tabIndex={0}
          aria-expanded={showDetail}
          onClick={() => setShowDetail(!showDetail)}
          onKeyDown={(e) =>
            acionaComEnterOuEspaco(e, () => setShowDetail(!showDetail))
          }
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
              </div>
              <div className="col-3">
                <p>Motivo:</p>
              </div>
              <div className="col-3">
                <p>Dia(s) de Inclusão:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
              </div>
            </div>
            {solicitacao.inclusoes.map((inclusao, idx) => {
              return (
                <div className="row" key={idx}>
                  {idx === 0 ? (
                    <div className="col-3">
                      <p>
                        <b># {solicitacao.id_externo}</b>
                      </p>
                    </div>
                  ) : (
                    <div className="col-3" />
                  )}
                  <div className="col-3">
                    <p>
                      <b className={`${ehDiaCancelado(inclusao)}`}>
                        {inclusao.motivo.nome}
                      </b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b className={`${ehDiaCancelado(inclusao)}`}>
                        {inclusao.data}
                      </b>
                    </p>
                  </div>
                  {idx === 0 ? (
                    <div className="col-3">
                      <p>
                        <b>{log && log.criado_em.split(" ")[0]}</b>
                      </p>
                    </div>
                  ) : (
                    <div className="col-3" />
                  )}
                  {inclusao.evento && (
                    <>
                      <div className="col-md-9 offset-md-3">
                        <p>Descrição do Evento:</p>
                      </div>
                      <div className="col-md-9 offset-md-3">
                        <p>{inclusao.evento}</p>
                      </div>
                      <div className="col-12 mb-3">
                        <div
                          className="linha-divisoria"
                          style={{ height: "1px", backgroundColor: "#858796" }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div className="row mt-3">
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
                <div className="row" key={idx}>
                  <div className="col-3">
                    <p>
                      <b>{quantidade_periodo.periodo_escolar.nome}</b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b>{tiposAlimentacao}</b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b>{quantidade_periodo.numero_alunos}</b>
                    </p>
                  </div>
                </div>
              );
            })}
            {solicitacao.inclusoes.find(
              (inclusao) => inclusao.cancelado_justificativa,
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.inclusoes
                    .filter((inclusao) => inclusao.cancelado_justificativa)
                    .map((inclusao, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {inclusao.data}
                          {" - "}
                          justificativa: {inclusao.cancelado_justificativa}
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
