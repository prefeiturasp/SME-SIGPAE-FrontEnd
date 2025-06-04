import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";

const IdentificacaoNutricionista = () => {
  return (
    <div className="row mt-3">
      <div className="col-9">
        <Field
          label="Identificação do Nutricionista"
          component={InputText}
          name="registro_funcional_nutricionista"
          disabled
        />
      </div>
    </div>
  );
};

export default IdentificacaoNutricionista;
