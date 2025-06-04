import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";

const MotivoNegacao = ({ motivoNegacao }) => {
  return (
    <div className="row mt-3">
      <div className="col-12 mb-3">
        <label className="sectionName">Motivo</label>
      </div>
      <div className="col-12">
        <Field
          component={InputText}
          name="motivo_nega"
          disabled={true}
          defaultValue={motivoNegacao.descricao}
        />
      </div>
    </div>
  );
};

export default MotivoNegacao;
