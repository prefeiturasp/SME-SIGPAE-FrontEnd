import React, { useState } from "react";

export const AlteracaoBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const log = solicitacao.logs[solicitacao.logs.length - 1];
  const [showDetail, setShowDetail] = useState(false);

  const ehDiaCancelado = (diaIntervalo) => {
    return diaIntervalo.cancelado || solicitacao.status === "ESCOLA_CANCELOU"
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
      <td className="text-center">
        {solicitacao.data_final
          ? solicitacao.data_inicial === solicitacao.data_final
            ? solicitacao.data_inicial
            : `${solicitacao.data_inicial} - ${solicitacao.data_final}`
          : solicitacao.alterar_dia}
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
            <div className="row mt-3" style={{ marginBottom: "-3em" }}>
              <div className="col-3">
                <p>ID da Solicitação:</p>
                <p>
                  <b># {solicitacao.id_externo}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Tipo de Alteração:</p>
              </div>
              <div className="col-3">
                <p>Dia(s) de Alteração:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            {solicitacao.datas_intervalo.map((data_intervalo, key) => {
              return (
                <div key={key} className="row">
                  <div className="offset-3 col-3">
                    <p>
                      <b className={`${ehDiaCancelado(data_intervalo)}`}>
                        {solicitacao.motivo.nome}
                      </b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b className={`${ehDiaCancelado(data_intervalo)}`}>
                        {data_intervalo.data}
                      </b>
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="row mt-3">
              <div className="col-3">
                <p>Período:</p>
              </div>
              <div className="col-3">
                <p>Alteração de Alimentação De:</p>
              </div>
              <div className="col-3">
                <p>Alteração de Alimentação Para:</p>
              </div>
            </div>

            {solicitacao.substituicoes.map((substituicao, idx) => {
              return (
                <div className="row" key={idx}>
                  <div className="col-3">
                    <p>
                      <b>{substituicao.periodo_escolar.nome}</b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b>
                        {substituicao.tipos_alimentacao_de
                          .map((ta) => ta.nome)
                          .join(", ")}
                      </b>
                    </p>
                  </div>
                  <div className="col-3">
                    <p>
                      <b>
                        {substituicao.tipos_alimentacao_para
                          .map((ta) => ta.nome)
                          .join(", ")}
                      </b>
                    </p>
                  </div>
                </div>
              );
            })}
            {solicitacao.observacao !== "<p></p>" && (
              <div className="row mt-3">
                <div className="col-12">
                  <p>Observação:</p>
                  <p
                    className="observacao-negrito"
                    dangerouslySetInnerHTML={{
                      __html: solicitacao.observacao,
                    }}
                  />
                </div>
              </div>
            )}
            {solicitacao.datas_intervalo.find(
              (data_intervalo) => data_intervalo.cancelado_justificativa,
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.datas_intervalo
                    .filter(
                      (data_intervalo) =>
                        data_intervalo.cancelado_justificativa,
                    )
                    .map((data_intervalo, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {data_intervalo.data}
                          {" - "}
                          justificativa:{" "}
                          {data_intervalo.cancelado_justificativa}
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
