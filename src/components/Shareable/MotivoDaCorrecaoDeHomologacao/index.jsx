import React from "react";
import * as R from "ramda";
import "./styles.scss";

export const getCorrecao = (logs) => {
  const arr = R.filter(
    R.propEq("status_evento_explicacao", "Questionamento pela CODAE"),
    logs
  );
  const lastLogQuestionamento = arr.pop();

  return lastLogQuestionamento;
};

export default ({ logs }) => {
  const correcao = getCorrecao(logs);

  if (!correcao) return false;

  return (
    <div className="componente-motivo-da-recusa-de-homologacao row">
      <div className="col-12">
        <div className="titulo-recusa">
          <p className="mb-1">{`Motivo da solicitação de correção do produto (Data: ${
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
