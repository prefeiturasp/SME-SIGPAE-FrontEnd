import React, { Component } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Botao from "src/components/Shareable/Botao";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";

import Substituicao from "./SubstituicaoFinalForm";

import "./style.scss";
import { required } from "src/helpers/fieldValidators";

export default class SubstituicoesField extends Component {
  render() {
    const { alimentos, produtos, form, values } = this.props;
    return (
      <div className="substituicoes-field">
        <FieldArray name="substituicoes">
          {({ fields }) => {
            return (
              fields.length > 0 && (
                <>
                  <div className="row">
                    <div className="col-4 substituicoes-label">Alimento</div>
                    <div className="col-3 substituicoes-label">
                      Isenção/Substituição
                    </div>
                    <div className="col-4 substituicoes-label">
                      Alimento/Ingrediente
                    </div>
                  </div>
                  {fields.map((name, index) => (
                    <Field
                      component={Substituicao}
                      name={name}
                      key={index}
                      index={index}
                      values={values}
                      form={form}
                      alimentos={alimentos}
                      produtos={produtos}
                      addOption={() => fields.push({})}
                      removeOption={() => fields.remove(index)}
                      validate={required}
                      deveHabilitarApagar
                      required
                    />
                  ))}
                </>
              )
            );
          }}
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
