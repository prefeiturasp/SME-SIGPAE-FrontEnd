import React from "react";
import "./styles.scss";

export const getCorrecao = (logs) => {
  return logs.find(
    (log) =>
      log.status_evento_explicacao ===
      "Terceirizada cancelou solicitação de homologação de produto"
  );
};

export default ({ logs }) => {
  const correcao = getCorrecao(logs);

  if (!correcao) return false;

  return (
    <div className="componente-motivo-da-recusa-de-homologacao row">
      <div className="col-12">
        <div className="titulo-recusa">
          <p className="mb-1">{`Motivo do cancelamento da homologação (Data: ${
            correcao.criado_em.split(" ")[0]
          }): `}</p>
          <p
            className="texto-wysiwyg-recusa"
            dangerouslySetInnerHTML={{
              __html: correcao.justificativa,
            }}
          />
        </div>
      </div>
    </div>
  );
};
