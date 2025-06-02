import React from "react";
import * as R from "ramda";
import "./styles.scss";

export const getRecusa = (logs) => {
  const arr = R.filter(
    R.propEq("status_evento_explicacao", "CODAE não homologou"),
    logs
  );
  return arr[0];
};

const MotivoDaRecusaDeHomologacao = ({ logs }) => {
  const recusa = getRecusa(logs);

  if (!recusa) return false;

  return (
    <div className="componente-motivo-da-recusa-de-homologacao row">
      <div className="col-12">
        <div className="titulo-recusa">
          <p className="mb-1">{`Motivo da recusa de homologação (Data: ${
            recusa.criado_em.split(" ")[0]
          }): `}</p>
          <p
            className="texto-wysiwyg-recusa"
            dangerouslySetInnerHTML={{
              __html: recusa.justificativa,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MotivoDaRecusaDeHomologacao;
