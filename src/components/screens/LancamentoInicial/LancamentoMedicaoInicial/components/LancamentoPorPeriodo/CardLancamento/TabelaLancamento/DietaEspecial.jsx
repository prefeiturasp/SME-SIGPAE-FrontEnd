import React from "react";
import { Field } from "react-final-form";

import { numericInteger } from "src/helpers/fieldValidators";

import BorderlessInput from "../../../BorderlessInput";

import "./styles.scss";

export default ({ formValues, prefix, panorama }) => (
  <div
    className={`tabela-lancamento tabela-dieta-especial${
      [4, 5].includes(panorama.horas_atendimento) ? "-3col" : "-4col"
    }`}
  >
    <div className="cabecalho-tabela">
      <div>
        <span>Dia</span>
      </div>
      <div>
        <span>Freq.</span>
      </div>
      {panorama.horas_atendimento !== 5 && (
        <div>
          <span>
            Lanche
            <br />4 h
          </span>
        </div>
      )}
      {panorama.horas_atendimento !== 4 && (
        <div>
          <span>
            Lanche
            <br />5 h
          </span>
        </div>
      )}
    </div>
    <div className="linha-tabela">
      <div>
        {formValues.data_lancamento &&
          formValues.data_lancamento.substring(0, 2)}
      </div>
      <div>
        <Field
          component={BorderlessInput}
          name={`${prefix}.frequencia`}
          validate={numericInteger}
        />
      </div>
      {panorama.horas_atendimento !== 5 && (
        <div>
          <Field
            component={BorderlessInput}
            name={`${prefix}.lanche_4h`}
            validate={numericInteger}
          />
        </div>
      )}
      {panorama.horas_atendimento !== 4 && (
        <div>
          <Field
            component={BorderlessInput}
            name={`${prefix}.lanche`}
            validate={numericInteger}
          />
        </div>
      )}
    </div>
  </div>
);
