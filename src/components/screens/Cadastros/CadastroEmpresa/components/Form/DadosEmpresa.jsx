import React from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import InputText from "src/components/Shareable/Input/InputText";
import { required, tamanhoCnpj } from "src/helpers/fieldValidators";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { cnpjMask } from "src/constants/shared";
import { Link } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";

const optionsTiposServico = [
  {
    nome: "Selecione...",
    uuid: "",
  },
  {
    nome: "Distribuidor (Armazém)",
    uuid: "DISTRIBUIDOR_ARMAZEM",
  },
  {
    nome: "Fornecedor",
    uuid: "FORNECEDOR",
  },
  {
    nome: "Fornecedor e Distribuidor",
    uuid: "FORNECEDOR_E_DISTRIBUIDOR",
  },
];
const optionsTiposEmpresas = [
  {
    nome: "Selecione...",
    uuid: "",
  },
  {
    nome: "Convencional",
    uuid: "CONVENCIONAL",
  },
  {
    nome: "Agricultura Familiar",
    uuid: "AGRICULTURA_FAMILIAR",
  },
];

const optionsTiposAlimento = [
  {
    nome: "Selecione...",
    uuid: "",
  },
  {
    nome: "Congelados e resfriados",
    uuid: "CONGELADOS_E_RESFRIADOS",
  },
  {
    nome: "FLVO",
    uuid: "FLVO",
  },
  {
    nome: "Pães & bolos",
    uuid: "PAES_E_BOLO",
  },
  {
    nome: "Secos",
    uuid: "SECOS",
  },
];

export const DadosEmpresa = ({ ehDistribuidor }) => {
  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce(
        (error, validator) => error || validator(value),
        undefined,
      );

  return (
    <>
      <div className="card-body">
        <div className="card-title green">Dados da Empresa</div>
        <div className="row pt-3">
          <div className="col-12 text-end">
            <Link to="/configuracoes/cadastros/empresas-cadastradas">
              <Botao
                texto="Empresas Cadastradas"
                style={BUTTON_STYLE.GREEN_OUTLINE}
              />
            </Link>
          </div>
        </div>

        <div className="row pt-3">
          <div className="col-9">
            <Field
              component={InputText}
              label="Razão social"
              name="razao_social"
              required
              validate={required}
              maxlength="150"
            />
          </div>
          {ehDistribuidor && (
            <div className="col-3">
              <Field
                component={InputText}
                label="Data de Cadastro"
                name="data_cadastro"
                disabled
              />
            </div>
          )}
        </div>
        <div className="row pt-3">
          <div className="col-8">
            <Field
              component={InputText}
              label="Nome Usual"
              name="nome_fantasia"
              required
              validate={required}
              maxlength="150"
            />
          </div>
          <div className="col-4">
            <Field
              component={MaskedInputText}
              mask={cnpjMask}
              label="CNPJ"
              name="cnpj"
              placeholder="Digite o CNPJ da Empresa"
              required
              validate={composeValidators(required, tamanhoCnpj)}
            />
          </div>
        </div>
        {ehDistribuidor && (
          <div className="row pt-3">
            <div className="col-4">
              <Field
                component={Select}
                label="Tipo de Serviço"
                name="tipo_servico"
                required
                naoDesabilitarPrimeiraOpcao
                options={optionsTiposServico}
                validate={required}
              />
            </div>
            <div className="col-4">
              <Field
                component={Select}
                label="Tipo de Empresa"
                name="tipo_empresa"
                required
                naoDesabilitarPrimeiraOpcao
                options={optionsTiposEmpresas}
                validate={required}
              />
            </div>
            <div className="col-4">
              <Field
                component={Select}
                label="Tipo de Alimento"
                name="tipo_alimento"
                required
                naoDesabilitarPrimeiraOpcao
                options={optionsTiposAlimento}
                validate={required}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
