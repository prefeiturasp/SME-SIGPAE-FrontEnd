import React from "react";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { usuarioEhNutriCODAE } from "src/helpers/utilities";

const ProtocoloLeitura = () => {
  return (
    <div className="row">
      {usuarioEhNutriCODAE() && (
        <div className="col-12">
          <Field
            component={InputText}
            className={"select-form-produto"}
            label="Protocolo Padrão"
            name="nome_protocolo_padrao"
            disabled={true}
          />
        </div>
      )}

      <div className="col-12">
        <Field
          component={InputText}
          className={"select-form-produto"}
          label="Nome do Protocolo"
          name="nome_protocolo"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default ProtocoloLeitura;
