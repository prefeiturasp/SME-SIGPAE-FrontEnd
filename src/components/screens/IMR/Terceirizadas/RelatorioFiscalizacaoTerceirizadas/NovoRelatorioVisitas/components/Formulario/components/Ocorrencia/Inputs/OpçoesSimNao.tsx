import React from "react";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";

type OpçoesSimNaoType = {
  titulo: string;
  name: string;
  somenteLeitura: boolean;
};

export const OpçoesSimNao = ({ ...props }: OpçoesSimNaoType) => {
  const { titulo, name, somenteLeitura } = props;

  return (
    <div className="col-12">
      <div>
        <span className="required-asterisk me-1">*</span>
        <label className="col-form-label">{titulo}</label>
      </div>

      <div className="row parametrizacao-tipo-radio">
        <div className="col-2 p-0 d-flex align-items-center">
          <Field
            name={name}
            component="input"
            type="radio"
            value="Sim"
            id="sim"
            required
            validate={required}
            style={{ paddingRight: 2 }}
            disabled={somenteLeitura}
          />
          <label htmlFor="sim">Sim</label>
        </div>
        <div className="col-2 p-0 d-flex align-items-center">
          <Field
            name={name}
            component="input"
            type="radio"
            value="Não"
            id="nao"
            required
            validate={required}
            disabled={somenteLeitura}
          />
          <label htmlFor="nao">Não</label>
        </div>
      </div>
    </div>
  );
};
