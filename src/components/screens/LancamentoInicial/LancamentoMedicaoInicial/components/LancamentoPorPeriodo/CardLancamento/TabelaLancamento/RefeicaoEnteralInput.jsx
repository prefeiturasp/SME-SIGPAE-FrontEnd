import React from "react";
import { Field } from "react-final-form";

import { numericInteger } from "src/helpers/fieldValidators";

import BorderlessInput from "../../../BorderlessInput";

import "./styles.scss";

export default ({ name, label, disabled }) => (
  <div className="tabela-lancamento tabela-campo-unico">
    <div className="cabecalho-tabela">
      <div>
        <span>{label}</span>
      </div>
    </div>
    <div className="linha-tabela">
      <div>
        <Field
          component={BorderlessInput}
          name={name}
          disabled={disabled}
          validate={numericInteger}
        />
      </div>
    </div>
  </div>
);
