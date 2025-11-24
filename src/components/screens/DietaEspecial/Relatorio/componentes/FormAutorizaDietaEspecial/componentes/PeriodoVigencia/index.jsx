import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

const PeriodoVigencia = () => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <p className="label mb-0">Período de Vigência</p>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <Field
            component={InputText}
            className={"select-form-produto"}
            label="Início"
            name="data_inicio"
            disabled={true}
          />
        </div>
        <div className="col-4">
          <Field
            component={InputText}
            className={"select-form-produto"}
            label="Fim"
            name="data_fim"
            disabled={true}
          />
        </div>
      </div>
    </>
  );
};

export default PeriodoVigencia;
