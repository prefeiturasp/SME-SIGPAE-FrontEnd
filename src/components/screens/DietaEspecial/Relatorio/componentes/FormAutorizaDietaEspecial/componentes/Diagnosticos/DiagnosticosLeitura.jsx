import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

const DiagnosticosLeitura = () => {
  return (
    <div className="row">
      <Field
        component={InputText}
        label="Relação por Diagnóstico"
        name="relacao_diagnosticos"
        disabled={true}
      />
    </div>
  );
};

export default DiagnosticosLeitura;
