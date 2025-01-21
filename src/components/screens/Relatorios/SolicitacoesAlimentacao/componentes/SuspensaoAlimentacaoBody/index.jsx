import React, { useState } from "react";

export const SuspensaoAlimentacaoBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
  const [showDetail, setShowDetail] = useState(false);
  const ehEscolaComum = solicitacao.escola.nome.includes("CEMEI")
    ? false
    : true;

  const ehDiaCancelado = (suspensao) => {
    return suspensao.cancelado || solicitacao.status === "ESCOLA_CANCELOU"
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
        {solicitacao.suspensoes_alimentacao.length > 1 ? (
          solicitacao.suspensoes_alimentacao.map((suspensao) => (
            <>
              {suspensao.data} <br />
            </>
          ))
        ) : (
          <>
            {item.data_evento}{" "}
            {item.data_evento_fim && item.data_evento !== item.data_evento_fim
              ? `- ${item.data_evento_fim}`
              : ""}
          </>
        )}
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
              </div>
              <div className="col-3">
                <p>Motivo:</p>
              </div>
              <div className="col-3">
                <p>Dia(s) de suspensão:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
              </div>
            </div>
            {solicitacao.suspensoes_alimentacao.map(
              (suspensao, idxSuspensao) => {
                return (
                  <div className="row mt-3" key={idxSuspensao}>
                    <div className="col-3">
                      {idxSuspensao === 0 && (
                        <p>
                          <b># {solicitacao.id_externo}</b>
                        </p>
                      )}
                    </div>
                    <div className="col-3">
                      <p>
                        <b className={`${ehDiaCancelado(suspensao)}`}>
                          {suspensao.motivo.nome}
                        </b>
                      </p>
                    </div>
                    <div className="col-3">
                      <p>
                        <b className={`${ehDiaCancelado(suspensao)}`}>
                          {suspensao.data}
                        </b>
                      </p>
                    </div>
                    <div className="col-3">
                      {idxSuspensao === 0 && (
                        <p>
                          <b>{solicitacao.criado_em.split(" ")[0]}</b>
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
            <div className="row mt-3">
              <div className="col-3">
                <p>Período:</p>
              </div>
              <div className="col-3">
                <p>Tipos de Alimentação:</p>
              </div>
              {!ehEscolaComum && (
                <div className="col-3">
                  <p>Alunos:</p>
                </div>
              )}
              <div className="col-3">
                <p>Quantidade:</p>
              </div>
            </div>
            {solicitacao.quantidades_por_periodo.map(
              (quantidade_periodo, idxQPP) => {
                return (
                  <div className="row mt-3" key={idxQPP}>
                    <div className="col-3">
                      <p>
                        <b>{quantidade_periodo.periodo_escolar.nome}</b>
                      </p>
                    </div>
                    <div className="col-3">
                      <p>
                        <b>
                          {quantidade_periodo.tipos_alimentacao
                            .map((ta) => ta.nome)
                            .join(", ")}
                        </b>
                      </p>
                    </div>
                    {!ehEscolaComum && (
                      <div className="col-3">
                        <p>
                          <b>{quantidade_periodo.alunos_cei_ou_emei}</b>
                        </p>
                      </div>
                    )}
                    <div className="col-3">
                      <p>
                        <b>{quantidade_periodo.numero_alunos}</b>
                      </p>
                    </div>
                  </div>
                );
              }
            )}
            {solicitacao.observacao && solicitacao.observacao !== "<p></p>" && (
              <div className="row">
                <div className="col-12">
                  <p>Observação:</p>
                  <b>
                    <p
                      className="observacao-negrito"
                      dangerouslySetInnerHTML={{
                        __html: solicitacao.observacao,
                      }}
                    />
                  </b>
                </div>
              </div>
            )}
            {solicitacao.suspensoes_alimentacao.find(
              (suspensao) => suspensao.cancelado_justificativa
            ) && (
              <>
                <hr />
                <p>
                  <strong>Histórico de cancelamento</strong>
                  {solicitacao.suspensoes_alimentacao
                    .filter((suspensao) => suspensao.cancelado_justificativa)
                    .map((suspensao, key) => {
                      return (
                        <div className="cancelado_justificativa" key={key}>
                          {suspensao.data}
                          {" - "}
                          justificativa: {suspensao.cancelado_justificativa}
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
