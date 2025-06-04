import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { cpfMask, telefoneMask } from "src/constants/shared";

export const AdministradorSistemaFormSet = ({ ehDistribuidor }) => {
  return (
    <>
      {!ehDistribuidor && (
        <>
          <hr className="linha-form" />
          <div>
            <div className="card-body">
              <div className="card-title green fw-bold">
                Principal administrador do sistema
              </div>
              <div className="row">
                <div className="col">
                  <Field
                    name="responsavel_email"
                    component={InputText}
                    label="E-mail"
                    type="email"
                    required
                    validate={required}
                    maxlength="140"
                  />
                </div>
                <div className="col">
                  <Field
                    name="responsavel_nome"
                    component={InputText}
                    label={"Nome"}
                    validate={required}
                    required
                    maxlength="140"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <Field
                    name="responsavel_cpf"
                    component={MaskedInputText}
                    mask={cpfMask}
                    label="CPF"
                    required
                    validate={required}
                  />
                </div>
                <div className="col">
                  <Field
                    name="responsavel_telefone"
                    component={MaskedInputText}
                    mask={telefoneMask}
                    label={"Telefone"}
                    validate={required}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Field
                    name="responsavel_cargo"
                    component={InputText}
                    label="Cargo"
                    required
                    validate={required}
                    maxlength="50"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
