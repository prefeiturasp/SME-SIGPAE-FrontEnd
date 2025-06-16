import React from "react";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoMedicaoInicial } from "src/components/Shareable/FluxoDeStatus/helper";

export const FluxoDeStatusMedicaoInicial = ({ solicitacaoMedicaoInicial }) => {
  const logs = () => {
    if (solicitacaoMedicaoInicial && solicitacaoMedicaoInicial.logs.length) {
      if (
        solicitacaoMedicaoInicial.logs.find((log) =>
          ["Aprovado pela DRE", "Correção solicitada"].includes(
            log.status_evento_explicacao
          )
        )
      ) {
        return solicitacaoMedicaoInicial.logs;
      }
      return solicitacaoMedicaoInicial.logs;
    } else {
      return fluxoMedicaoInicial;
    }
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <b className="section-title">
            Progresso de validação das refeições informadas
          </b>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12">
          <FluxoDeStatus
            listaDeStatus={logs()}
            fluxo={fluxoMedicaoInicial}
            eh_medicao_inicial={true}
          />
        </div>
      </div>
    </>
  );
};
