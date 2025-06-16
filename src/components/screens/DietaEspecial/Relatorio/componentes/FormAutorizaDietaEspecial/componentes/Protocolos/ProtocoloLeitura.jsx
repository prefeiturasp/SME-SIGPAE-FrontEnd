import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";

const ProtocoloLeitura = () => {
  return (
    <div className="row">
      <div className="col-12">
        <Field
          component={InputText}
          className={"select-form-produto"}
          label="Nome do Protocolo Padrão de Dieta Especial"
          name="nome_protocolo_padrao"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default ProtocoloLeitura;
