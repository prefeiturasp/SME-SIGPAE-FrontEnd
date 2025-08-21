import React, { Component } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Botao from "../../../../../Shareable/Botao";
import { BUTTON_STYLE } from "../../../../../Shareable/Botao/constants";

import Substituicao from "./SubstituicaoFinalForm";

import "./style.scss";
import { required } from "../../../../../../helpers/fieldValidators";

export default class SubstituicoesField extends Component {
  render() {
    const { alimentos, produtos, form, values } = this.props;
    return (
      <div className="substituicoes-field">
        <div className="row">
          <div className="col-4">Alimento</div>
          <div className="col-3">Isenção/Substituição</div>
          <div className="col-4">Alimento/Ingrediente</div>
        </div>
        <FieldArray name="substituicoes">
          {({ fields }) =>
            fields.map((name, index) => (
              <>
                <Field
                  component={Substituicao}
                  name={name}
                  key={values.substituicoes[index]?.id}
                  chave={index}
                  values={values}
                  form={form}
                  alimentos={alimentos}
                  produtos={produtos}
                  addOption={() => fields.push({})}
                  removeOption={() => {
                    fields.remove(index);
                  }}
                  validate={required}
                  deveHabilitarApagar={fields.length > 1}
                  required
                />
              </>
            ))
          }
        </FieldArray>
        <div className="row mt-2">
          <div className="col-2">
            <Botao
              texto="Adicionar Item"
              onClick={() => form.mutators.push("substituicoes", {})}
              style={BUTTON_STYLE.GREEN}
            />
          </div>
        </div>
      </div>
    );
  }
}
