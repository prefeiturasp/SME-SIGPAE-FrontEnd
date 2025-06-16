import { stringSeparadaPorVirgulas } from "src/helpers/utilities";
import React, { useState } from "react";

export const InversaoCardapioBody = ({ ...props }) => {
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
        {item.data_evento}{" "}
        {item.data_evento_fim && item.data_evento !== item.data_evento_fim
          ? `- ${item.data_evento_fim}`
          : ""}
        {solicitacao.data_de_inversao_2 && (
          <>
            <br />
            {solicitacao.data_de_inversao_2}
          </>
        )}
      </td>
      <td className="text-center">{"-"}</td>
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
                <p>Substituição De:</p>
                <p>
                  <b>{solicitacao.data_de}</b>
                </p>
              </div>
              <div className="col-3">
                <p>Substituição Para:</p>
                <p>
                  <b>{solicitacao.data_para}</b>
                </p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
                <p>
                  <b>{log && log.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            {solicitacao.data_de_inversao_2 && (
              <div className="row mt-3">
                <div className="col-3">
                  <p>Substituição De:</p>
                  <p>
                    {solicitacao.data_de_inversao_2 && (
                      <>
                        <strong>{solicitacao.data_de_inversao_2}</strong>
                      </>
                    )}
                  </p>
                </div>
                <div className="col-3">
                  <p>Substituição Para:</p>
                  <p>
                    {solicitacao.data_para_inversao_2 && (
                      <b>{solicitacao.data_para_inversao_2}</b>
                    )}
                  </p>
                </div>
              </div>
            )}
            {solicitacao.motivo && solicitacao.motivo !== "<p></p>" && (
              <div className="row">
                {solicitacao.tipos_alimentacao.length > 0 && (
                  <div className="col-3">
                    <p>Tipos de Alimentação:</p>
                    <p style={{ fontWeight: "bold" }}>
                      {stringSeparadaPorVirgulas(
                        solicitacao.tipos_alimentacao,
                        "nome"
                      )}
                    </p>
                  </div>
                )}
                <div className="col-3">
                  <p>Motivo:</p>
                  <b>
                    <p
                      className="observacao-negrito"
                      dangerouslySetInnerHTML={{
                        __html: solicitacao.motivo,
                      }}
                    />
                  </b>
                </div>
                {solicitacao.observacao &&
                  solicitacao.observacao !== "<p></p>" && (
                    <div className="col-3">
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
                  )}
              </div>
            )}
          </div>
        </td>
      </tr>
    ),
  ];
};
