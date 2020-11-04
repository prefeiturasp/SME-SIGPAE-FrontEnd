import React from "react";
import { Field } from "react-final-form";

import { numericInteger } from "helpers/fieldValidators";

import BorderlessInput from "../../../BorderlessInput";
import CabecalhoDietaConvencional from "./CabecalhoDietaConvencional";

import "./styles.scss";

export default ({ formValues }) => (
  <div className="tabela-lancamento tabela-dieta-convencional">
    <CabecalhoDietaConvencional />
    <div className="linha-tabela">
      <div>
        {formValues.data_lancamento &&
          formValues.data_lancamento.substring(0, 2)}
      </div>
      <div>
        <Field
          component={BorderlessInput}
          name="convencional.troca"
          validate={numericInteger}
          disabled
        />
      </div>
      <div>
        <Field
          component={BorderlessInput}
          name="convencional.merenda_seca"
          validate={numericInteger}
        />
      </div>
      <div>
        <Field
          component={BorderlessInput}
          name="convencional.kits_lanches"
          validate={numericInteger}
          disabled
        />
      </div>
      <div>
        <Field
          component="input"
          name="convencional.eh_dia_de_sobremesa_doce"
          type="checkbox"
          style={{ width: "35%" }}
        />
      </div>
    </div>
  </div>
);
