import React from "react";

export const MotivoCancelamento = ({ logs }) => {
  const getCorrecao = (logs) => {
    return logs.find(
      (log) =>
        log.status_evento_explicacao ===
        "Terceirizada cancelou solicitação de homologação de produto"
    );
  };

  const correcao = getCorrecao(logs);
  return (
    <div className="row">
      <div className="col-12">
        <label className="col-form-label ">{`Motivo do cancelamento da homologação (Data: ${
          correcao.criado_em.split(" ")[0]
        }) `}</label>
      </div>
      <div className="col-12">
        <p
          className="justificativa-ficha-produto no-margin"
          dangerouslySetInnerHTML={{
            __html: correcao.justificativa,
          }}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default MotivoCancelamento;
