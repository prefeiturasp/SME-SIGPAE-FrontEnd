import React from "react";
import { Collapse } from "react-collapse";

import "../style.scss";
import "./style.scss";

import { DataInclusao } from "../DataInclusao";
import { InclusoesCEI } from "./InclusoesCEI";

export const SolicitacoesSimilaresInclusaoCEI = ({ ...props }) => {
  const { solicitacao, index } = props;

  const todasDatasCanceladas =
    solicitacao.dias_motivos_da_inclusao_cei?.length > 0 &&
    solicitacao.dias_motivos_da_inclusao_cei.every(
      (inclusao) => inclusao.cancelado,
    );

  const justificativaCancelamento =
    solicitacao.dias_motivos_da_inclusao_cei?.find(
      (inclusao) => inclusao.cancelado_justificativa,
    )?.cancelado_justificativa;

  const renderDataSolicitacao = (solicitacao) => {
    if (solicitacao.data_inicial && solicitacao.data_final) {
      return (
        <>
          <div className="col-2">
            <p>DE:</p>
            <p className={todasDatasCanceladas ? "data-periodo-cancelado" : ""}>
              <b>{solicitacao.data_inicial}</b>
            </p>
          </div>
          <div className="col-2">
            <p>ATÉ:</p>
            <p className={todasDatasCanceladas ? "data-periodo-cancelado" : ""}>
              <b>{solicitacao.data_final}</b>
            </p>
          </div>
          {todasDatasCanceladas && justificativaCancelamento && (
            <div className="col-4">
              <p className="justificativa-cancelamento dark-red">
                <span className="fw-bold">justificativa: </span>
                {justificativaCancelamento}
              </p>
            </div>
          )}
        </>
      );
    }
    return (
      <div className="col-4">
        <p>Dia(s) de inclusão:</p>
        <div>
          {solicitacao.dias_motivos_da_inclusao_cei &&
            solicitacao.dias_motivos_da_inclusao_cei.map((inclusao, index) => (
              <DataInclusao
                key={index}
                inclusao={inclusao}
                status={solicitacao.status}
                logs={solicitacao.logs}
              />
            ))}
        </div>
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
                      solicitacao.dias_motivos_da_inclusao_cei[0].motivo.nome}
                  </b>
                </p>
              </div>
              {renderDataSolicitacao(solicitacao)}
            </div>
            <InclusoesCEI inclusaoDeAlimentacao={solicitacao} />
          </div>
        </td>
      </tr>
    </Collapse>
  );
};
