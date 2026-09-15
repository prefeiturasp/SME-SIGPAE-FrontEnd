import React, { useState } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";

export const SuspensaoAlimentacaoCEIBody = ({ ...props }) => {
  const { solicitacao, item, index, filtros, labelData } = props;
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
      </td>
      <td className="text-center">{"-"}</td>
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
                <p>Dia(s) de suspensão:</p>
              </div>
              <div className="col-3">
                <p>{labelData}</p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <p>
                  <b># {solicitacao.id_externo}</b>
                </p>
              </div>
              <div className="col-3">
                <p>
                  <b>{solicitacao.motivo.nome}</b>
                </p>
              </div>
              <div className="col-3">
                <p>
                  <b>{solicitacao.data}</b>
                </p>
              </div>
              <div className="col-3">
                <p>
                  <b>{solicitacao.criado_em.split(" ")[0]}</b>
                </p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <p>Período:</p>
              </div>
              <div className="col-3">
                <p>Tipos de Alimentação:</p>
              </div>
              <div className="col-3" />
            </div>
            {solicitacao.periodos_escolares.map((periodo, idxPeriodo) => {
              let tiposAlimentacaoPeriodo =
                solicitacao.escola.periodos_escolares.find(
                  (pe) => pe.nome === periodo.nome,
                );
              tiposAlimentacaoPeriodo =
                tiposAlimentacaoPeriodo.tipos_alimentacao
                  .map((ta) => ta.nome)
                  .join(", ");
              return (
                <div className="row mt-3" key={idxPeriodo}>
                  <div className="col-3">
                    <p>
                      <b>{periodo.nome}</b>
                    </p>
                  </div>
                  <div className="col-6">
                    <p>
                      <b>{tiposAlimentacaoPeriodo}</b>
                    </p>
                  </div>
                  <div className="col-3" />
                </div>
              );
            })}
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
          </div>
        </td>
      </tr>
    ),
  ];
};
