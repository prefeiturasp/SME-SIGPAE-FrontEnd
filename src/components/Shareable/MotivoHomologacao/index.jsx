import React from "react";
import "./styles.scss";
import { getLog } from "src/helpers/utilities";

const MotivoHomologacao = ({ logs }) => {
  const homolog = getLog(logs, "CODAE não homologou");
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
