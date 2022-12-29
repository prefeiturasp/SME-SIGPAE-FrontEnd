import React, { useState } from "react";

export const InclusaoBody = ({ ...props }) => {
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
      <td className="text-center">{solicitacao.datas}</td>
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
              <div className="col-4">
                <p>Motivo:</p>
              </div>
              <div className="col-4">
                <p>Dia(s) de Inclusão:</p>
              </div>
              <div className="col-4">
                <p>{labelData}</p>
              </div>
            </div>
            {solicitacao.inclusoes.map((inclusao, idx) => {
              return (
                <div className="row" key={idx}>
                  <div className="col-4">
                    <p>
                      <b>{inclusao.motivo.nome}</b>
                    </p>
                  </div>
                  <div className="col-4">
                    <p>
                      <b>{inclusao.data}</b>
                    </p>
                  </div>
                  {idx === 0 ? (
                    <div className="col-4">
                      <p>
                        <b>{log && log.criado_em.split(" ")[0]}</b>
                      </p>
                    </div>
                  ) : (
                    <div className="col-4" />
                  )}
                </div>
              );
            })}
            <div className="row mt-3">
              <div className="col-4">
                <p>Período:</p>
              </div>
              <div className="col-4">
                <p>Tipos de Alimentação:</p>
              </div>
              <div className="col-4">
                <p>No de Alunos:</p>
              </div>
            </div>
            {solicitacao.quantidades_periodo.map((quantidade_periodo, idx) => {
              const tiposAlimentacao = quantidade_periodo.tipos_alimentacao
                .map(tipo_alimentacao => tipo_alimentacao.nome)
                .join(", ");
              return (
                <div className="row" key={idx}>
                  <div className="col-4">
                    <p>
                      <b>{quantidade_periodo.periodo_escolar.nome}</b>
                    </p>
                  </div>
                  <div className="col-4">
                    <p>
                      <b>{tiposAlimentacao}</b>
                    </p>
                  </div>
                  <div className="col-4">
                    <p>
                      <b>{quantidade_periodo.numero_alunos}</b>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </td>
      </tr>
    )
  ];
};
