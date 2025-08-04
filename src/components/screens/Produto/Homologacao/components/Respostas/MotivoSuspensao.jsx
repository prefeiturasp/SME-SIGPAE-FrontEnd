import React from "react";
import { getLog } from "src/helpers/utilities";

export const MotivoSuspensao = ({ logs }) => {
  const suspensao = getLog(logs, "CODAE suspendeu o produto");
  if (!suspensao) return false;
  return (
    <div className="row">
      <div className="col-12">
        <label className="col-form-label">
          {`Motivo da suspensão (Data: ${suspensao.criado_em.split(" ")[0]})`}
        </label>
      </div>
      <div className="col-12">
        <p
          className="justificativa-ficha-produto no-margin"
          dangerouslySetInnerHTML={{
            __html: suspensao.justificativa,
          }}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};

export default MotivoSuspensao;
