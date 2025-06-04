import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";

const MotivoAlteracao = (motivo) => {
  return (
    <div className="row mt-3">
      <div className="col-6">
        <Field
          label="Motivo da alteração"
          component={InputText}
          name="motivo_alteracao"
          defaultValue={
            motivo !== undefined && motivo.motivo !== null
              ? motivo.motivo.nome
              : ""
          }
          disabled
        />
      </div>
    </div>
  );
};

export default MotivoAlteracao;
