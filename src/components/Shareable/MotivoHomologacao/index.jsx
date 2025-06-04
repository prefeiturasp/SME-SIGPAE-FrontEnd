import React from "react";
import * as R from "ramda";
import "./styles.scss";

export const getHomologacao = (logs) => {
  const arr = R.filter(
    R.propEq("status_evento_explicacao", "CODAE homologou"),
    logs
  );
  return arr[0];
};

const MotivoHomologacao = ({ logs }) => {
  const homolog = getHomologacao(logs);

  if (!homolog) return false;

  return (
    <div className="componente-motivo-da-recusa-de-homologacao row">
      <div className="col-12">
        <div className="titulo-recusa">
          <p className="mb-1">{`Produto homologado em: ${
            homolog.criado_em.split(" ")[0]
          }`}</p>
        </div>
      </div>
    </div>
  );
};

export default MotivoHomologacao;
