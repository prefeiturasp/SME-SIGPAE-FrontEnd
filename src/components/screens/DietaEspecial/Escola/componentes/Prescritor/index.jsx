import React from "react";
import { Field } from "redux-form";
import InputText from "../../../../../Shareable/Input/InputText";

import {
  minLength,
  required,
  numericInteger,
  maxLength,
} from "src/helpers/fieldValidators";

const minLength6 = minLength(6);
export default ({ pertence_a_escola }) => {
  return (
    <section className="row">
      <div className="col-7">
        <Field
          component={InputText}
          label="Nome do Prescritor do laudo (médico, nutricionista, fonoaudiólogo)"
          name="nome_completo_pescritor"
          placeholder="Insira o Nome do Prescritor"
          className="form-control"
          required
          validate={[required, minLength6]}
          helpText={"Mínimo 6 caracteres"}
          tabindex="2"
          disabled={pertence_a_escola !== true}
        />
      </div>
      <div className="col-5">
        <Field
          component={InputText}
          label="CRM/CRN/CRFa/RMS"
          name="registro_funcional_pescritor"
          required
          className="form-control"
          helpText={"Tamanho: 4 a 7 caracteres"}
          disabled={pertence_a_escola !== true}
          validate={[required, numericInteger, maxLength(7), minLength(4)]}
        />
      </div>
    </section>
  );
};
