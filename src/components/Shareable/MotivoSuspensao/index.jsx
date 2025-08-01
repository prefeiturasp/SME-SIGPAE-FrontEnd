import React from "react";
import "./styles.scss";

export const getSuspensao = (logs) => {
  return logs.find(
    (log) => log.status_evento_explicacao === "CODAE suspendeu o produto"
  );
};

const MotivoSuspensao = ({ logs }) => {
  const suspensao = getSuspensao(logs);

  if (!suspensao) return false;

  return (
    <div className="componente-motivo-da-suspensao row">
      <div className="col-12">
        <div className="titulo-suspensao">
          <p className="mb-1">{`Motivo da suspensão (Data: ${
            suspensao.criado_em.split(" ")[0]
          }): `}</p>
          <p
            className="texto-wysiwyg-suspensao"
            dangerouslySetInnerHTML={{
              __html: suspensao.justificativa,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MotivoSuspensao;
