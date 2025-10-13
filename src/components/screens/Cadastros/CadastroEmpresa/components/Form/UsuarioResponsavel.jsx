import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { cpfMask, telefoneMask } from "src/constants/shared";

export const UsuarioResponsavel = ({ ehDistribuidor }) => {
  return (
    <>
      {ehDistribuidor ? (
        <>
          <hr className="linha-form" />
          <div className="card-body">
            <div className="card-title green">
              Dados do Representante do Contrato
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  component={InputText}
                  label="Nome"
                  name="responsavel_nome"
                  validate={required}
                  required
                  maxlength="150"
                />
              </div>
              <div className="col-4">
                <Field
                  component={MaskedInputText}
                  mask={cpfMask}
                  label="CPF"
                  name="responsavel_cpf"
                  validate={required}
                  required
                />
              </div>
              <div className="col-4">
                <Field
                  component={InputText}
                  label="Cargo"
                  name="responsavel_cargo"
                  validate={required}
                  required
                  maxlength="40"
                />
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-4">
                <Field
                  component={MaskedInputText}
                  mask={telefoneMask}
                  label="Telefone"
                  name="responsavel_telefone"
                  cenario="distribuidor"
                  validate={required}
                  required
                />
              </div>
              <div className="col-8">
                <Field
                  component={InputText}
                  label="E-mail"
                  name="responsavel_email"
                  type="email"
                  validate={required}
                  required
                  maxlength="150"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <hr className="linha-form" />
          <div className="card-body">
            <div className="row">
              <div className="col-7">
                <Field
                  component={InputText}
                  label="Representante Legal"
                  name="representante_legal"
                  validate={required}
                  required
                  maxlength="140"
                />
              </div>
              <div className="col-5">
                <Field
                  component={MaskedInputText}
                  mask={telefoneMask}
                  name="telefone_representante"
                  label="Telefone"
                  id="telefone_representante"
                  cenario="contatoRepresentante"
                />
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-7">
                <Field
                  component={InputText}
                  label="E-mail"
                  name="representante_email"
                  maxlength="140"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
