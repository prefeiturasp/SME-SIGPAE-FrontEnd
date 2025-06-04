import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

const ClassificacaoDaDietaLeitura = () => {
  return (
    <div className="row mt-3">
      <div className="col-4">
        <Field
          component={InputText}
          className={"select-form-produto"}
          label="Classificação da Dieta"
          name="classificacao_nome"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default ClassificacaoDaDietaLeitura;
