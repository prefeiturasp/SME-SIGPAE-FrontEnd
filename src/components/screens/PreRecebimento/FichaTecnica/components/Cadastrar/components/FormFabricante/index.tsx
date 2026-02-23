import React from "react";
import { Field } from "react-final-form";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { cepMask, cnpjMask, telefoneMask } from "src/constants/shared";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import {
  required,
  email,
  composeValidators,
} from "src/helpers/fieldValidators";
import { OptionsGenerico } from "src/interfaces/pre_recebimento.interface";

interface Props {
  fabricantesCount: number;
  setFabricantesCount?: (_count: number) => void;
  fabricantesOptions?: OptionsGenerico[];
  values: Record<string, any>;
  desabilitaEndereco?: Array<boolean>;
  gerenciaModalCadastroExterno?: () => void;
  somenteLeitura?: boolean;
  ocultarBotaoCadastroFabricante?: boolean;
}

const FormFabricante: React.FC<Props> = ({
  fabricantesCount,
  setFabricantesCount,
  fabricantesOptions,
  values,
  desabilitaEndereco,
  somenteLeitura,
  gerenciaModalCadastroExterno,
  ocultarBotaoCadastroFabricante = false,
}) => {
  return (
    <>
      {Array.from({ length: fabricantesCount }).map((_, idx) => (
        <>
          <div className="col-12 d-flex justify-content-between align-items-center mb-3">
            {somenteLeitura ? (
              <div className="subtitulo">
                {idx === 0 ? `Fabricante` : `Envasador/Distribuidor`}
              </div>
            ) : (
              <h5 className="verde-escuro fw-bold mb-0">
                Informe os dados do{" "}
                {idx === 0 ? "Fabricante" : "Envasador/Distribuidor"}
              </h5>
            )}
            {!somenteLeitura && idx > 0 && (
              <div className="d-flex align-items-center">
                <Botao
                  icon="fas fa-trash"
                  dataTestId="excluir-envasador"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-1"
                  onClick={() => setFabricantesCount(1)}
                />
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-6">
              {somenteLeitura ? (
                <Field
                  component={InputText}
                  label="Nome da Empresa/Organização"
                  name={`fabricante_${idx}`}
                  className="input-ficha-tecnica"
                  disabled={true}
                />
              ) : (
                <Field
                  component={AutoCompleteSelectField}
                  dataTestId={`fabricante_${idx}`}
                  label={
                    idx === 0
                      ? "Fabricante ou Produtor"
                      : "Envasador/Distribuidor"
                  }
                  name={`fabricante_${idx}`}
                  options={getListaFiltradaAutoCompleteSelect(
                    fabricantesOptions.map((e) => e.nome),
                    values[`fabricante_${idx}`],
                  )}
                  placeholder={`Selecione o ${
                    idx === 0 ? "Fabricante" : "Envasador/Distribuidor"
                  }`}
                  className="input-ficha-tecnica"
                  required
                  validate={required}
                />
              )}
            </div>
            <div className="col-3 cadastro-externo">
              {somenteLeitura || ocultarBotaoCadastroFabricante || (
                <Botao
                  texto={`Cadastrar ${
                    idx === 0 ? "Fabricante" : "Envasador/Distribuidor"
                  }`}
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="botao-cadastro-externo"
                  onClick={gerenciaModalCadastroExterno}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Field
                component={MaskedInputText}
                mask={cnpjMask}
                label="CNPJ"
                name={`cnpj_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o CNPJ"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Field
                component={MaskedInputText}
                mask={cepMask}
                label="CEP"
                name={`cep_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o CEP"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura}
              />
            </div>
            <div className="col-8">
              <Field
                component={InputText}
                label="Endereço"
                name={`endereco_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o endereço"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura || desabilitaEndereco[idx]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Field
                component={InputText}
                label="Número"
                name={`numero_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o Número"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura}
              />
            </div>
            <div className="col-4">
              <Field
                component={InputText}
                label="Complemento"
                name={`complemento_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o Complemento"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura}
              />
            </div>
            <div className="col-4">
              <Field
                component={InputText}
                label="Bairro"
                name={`bairro_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o Bairro"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura || desabilitaEndereco[idx]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <Field
                component={InputText}
                label="Cidade"
                name={`cidade_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite a Cidade"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura || desabilitaEndereco[idx]}
              />
            </div>
            <div className="col-4">
              <Field
                component={InputText}
                label="Estado"
                name={`estado_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o Estado"}
                className="input-ficha-tecnica"
                disabled={somenteLeitura || desabilitaEndereco[idx]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <Field
                component={InputText}
                label="E-mail"
                name={`email_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o E-mail"}
                className="input-ficha-tecnica"
                required
                validate={composeValidators(required, email)}
                disabled={somenteLeitura}
              />
            </div>
            <div className="col-4">
              <Field
                component={MaskedInputText}
                mask={telefoneMask}
                label="Telefone"
                name={`telefone_fabricante_${idx}`}
                placeholder={somenteLeitura ? "" : "Digite o Telefone"}
                className="input-ficha-tecnica"
                required
                validate={required}
                disabled={somenteLeitura}
              />
            </div>
          </div>
          {idx < fabricantesCount - 1 && <hr className="my-4" />}
        </>
      ))}
    </>
  );
};

export default FormFabricante;
