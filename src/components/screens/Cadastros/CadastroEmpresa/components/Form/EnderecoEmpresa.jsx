import React from "react";
import { Field, useForm } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { buscaCep } from "../../helper";
import { required } from "helpers/fieldValidators";
import { OnChange } from "react-final-form-listeners";
import { useState } from "react";
import MaskedInputText from "components/Shareable/Input/MaskedInputText";
import { cepMask } from "constants/shared";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";

export const EnderecoEmpresa = ({
  ehDistribuidor,
  contatosEmpresaForm,
  setContatosEmpresaForm,
  contatosEmpresa,
  setContatosEmpresa
}) => {
  const [camposEnderecoDesabilitado, setCamposEnderecoDesabilitado] = useState(
    true
  );
  const [qtdFieldCep, setQtdFieldCep] = useState(8);
  const form = useForm();
  const composeValidators = (...validators) => value =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  const temTracos = value => {
    const valid = value.indexOf("-") > -1;
    if (valid) {
      setQtdFieldCep(9);
    } else {
      if (qtdFieldCep !== 8) {
        setQtdFieldCep(8);
      }
    }
    return valid;
  };

  const nomeFormContatoEmpresa = () => {
    const indiceDoFormAtual = `contatoEmpresa_${contatosEmpresaForm.length}`;
    let contatosEmpresaFormArray = [...contatosEmpresaForm];
    contatosEmpresaFormArray.push(indiceDoFormAtual);
    setContatosEmpresaForm(contatosEmpresaFormArray);
  };

  const adicionaContatoEmpresa = () => {
    let contatosEmpresaArray = [...contatosEmpresa];
    contatosEmpresaArray.push([
      {
        telefone: "",
        email: ""
      }
    ]);
    setContatosEmpresa(contatosEmpresaArray);
  };

  return (
    <>
      <hr className="linha-form my-3" />
      <div className="card-title green">Endereço da Empresa</div>
      <div className="row pt-3">
        <div className="col-3">
          <Field
            label="CEP"
            name={`cep`}
            component={MaskedInputText}
            mask={cepMask}
            maxlength={qtdFieldCep}
            required
            validate={required}
          />
          <OnChange name="cep">
            {async value => {
              temTracos(value);
              if (
                value &&
                ((value.length === 8 && !temTracos(value)) ||
                  value.length === 9)
              ) {
                const dadosEndereco = await buscaCep(value.replace("-", ""));
                form.change("bairro", dadosEndereco.bairro);
                form.change("cidade", dadosEndereco.cidade);
                form.change("endereco", dadosEndereco.endereco);
                form.change("estado", dadosEndereco.estado);
                setCamposEnderecoDesabilitado(dadosEndereco.desabilitado);
              } else {
                form.change("bairro", null);
                form.change("cidade", null);
                form.change("endereco", null);
                form.change("estado", null);
                setCamposEnderecoDesabilitado(true);
              }
            }}
          </OnChange>
        </div>
        <div className="col-9">
          <Field
            component={InputText}
            label="Endereço"
            name="endereco"
            required
            maxlength="150"
            disabled={camposEnderecoDesabilitado}
          />
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-3">
          <Field
            component={InputText}
            label="Número"
            name="numero"
            maxlength="5"
          />
        </div>
        <div className="col-4">
          <Field
            component={InputText}
            label="Complemento"
            name="complemento"
            maxlength="45"
          />
        </div>
        <div className="col-5">
          <Field
            component={InputText}
            label="Bairro"
            name="bairro"
            required
            maxlength="140"
            disabled={camposEnderecoDesabilitado}
          />
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-6">
          <Field
            component={InputText}
            label="Cidade"
            name="cidade"
            required
            disabled={camposEnderecoDesabilitado}
            maxlength="140"
          />
        </div>
        <div className="col-6">
          <Field
            component={InputText}
            label="Estado"
            name="estado"
            required
            disabled={camposEnderecoDesabilitado}
            maxlength="140"
          />
        </div>
      </div>

      {!ehDistribuidor && (
        <div className="container-fields row">
          <div className="col-11">
            {contatosEmpresaForm.map((contatoEmpresa, indiceEmpresa) => {
              return (
                <div key={indiceEmpresa}>
                  <div className="row pt-3">
                    <div className="col-5">
                      <Field
                        name={`telefone_empresa_${indiceEmpresa}`}
                        component={InputText}
                        label="Telefone"
                        id={`telefone_empresa_${indiceEmpresa}`}
                        indice={indiceEmpresa}
                        cenario="contatoEmpresa"
                        validate={required}
                        required
                        maxlength="140"
                      />
                    </div>
                    <div className="col-7">
                      <Field
                        name={`email_empresa_${indiceEmpresa}`}
                        component={InputText}
                        label="E-mail"
                        maxlength="140"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`col-1 mt-auto mb-1`}>
            <Botao
              texto="+"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                nomeFormContatoEmpresa();
                adicionaContatoEmpresa();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
