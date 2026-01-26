import React from "react";
import { Field } from "react-final-form";
import { required } from "src/helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";

interface Props {
  values: Record<string, any>;
  desabilitar?: boolean;
  atualizacao?: boolean;
}

const FormPereciveisENaoPereciveis: React.FC<Props> = ({
  values,
  desabilitar = false,
  atualizacao = false,
}) => {
  return (
    <div>
      <div className="row">
        <div className="col-4">
          <Field
            component={InputText}
            dataTestId="prazo_validade"
            label="Prazo de Validade"
            name={`prazo_validade`}
            placeholder="Informe o Prazo de Validade"
            className="input-ficha-tecnica"
            required
            validate={required}
            tooltipText={
              "Deve ser declarado o prazo em dias, meses ou anos a partir da data de fabricação."
            }
            disabled={desabilitar}
          />
        </div>
        <div className="col-8">
          <Field
            component={InputText}
            dataTestId="numero_registro"
            label="Nº do Registro do Rótulo do Produto e Nome do Órgão Competente"
            name={`numero_registro`}
            placeholder="Digite o Número do Registro do Órgão Competente"
            className="input-ficha-tecnica"
            disabled={desabilitar}
            tooltipText={
              "Deverá ser preenchido para produtos de origem animal, sucos e fórmula infantil."
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <p className="label-radio">
            <span className="required-asterisk">*</span>O Produto é orgânico?
          </p>
          <label className="container-radio">
            Não
            <Field
              component="input"
              data-testid="organico-nao"
              type="radio"
              value="0"
              name={`organico`}
              validate={required}
              disabled={desabilitar}
            />
            <span className="checkmark" />
          </label>
          <label className="container-radio">
            Sim
            <Field
              component="input"
              data-testid="organico-sim"
              type="radio"
              value="1"
              name={`organico`}
              validate={required}
              disabled={desabilitar}
            />
            <span className="checkmark" />
          </label>
        </div>

        {values.organico === "1" && (
          <div className="col-4">
            <p className="label-radio">
              <span className="required-asterisk">*</span>Qual é o mecanismo de
              controle?
            </p>
            <label className="container-radio">
              Certificação
              <Field
                component="input"
                type="radio"
                value="CERTIFICACAO"
                name={`mecanismo_controle`}
                validate={required}
                disabled={desabilitar}
              />
              <span className="checkmark" />
            </label>
            <label className="container-radio">
              OPAC
              <Field
                component="input"
                type="radio"
                value="OPAC"
                name={`mecanismo_controle`}
                validate={required}
                disabled={desabilitar}
              />
              <span className="checkmark" />
            </label>
            <label className="container-radio">
              OCS
              <Field
                component="input"
                type="radio"
                value="OCS"
                name={`mecanismo_controle`}
                validate={required}
                disabled={desabilitar}
              />
              <span className="checkmark" />
            </label>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-12">
          <Field
            component={InputText}
            dataTestId={"componentes_produto"}
            label="Componentes do Produto"
            name={`componentes_produto`}
            placeholder="Digite Todos os Componentes Utilizados na Composição do Produto"
            className="input-ficha-tecnica"
            required
            validate={required}
            tooltipText={
              "Caso utilizado aditivos alimentares, deverá ser declarada a função principal, nome completo e número INS de todos."
            }
            disabled={desabilitar && !atualizacao}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p className="label-radio">
            <span className="required-asterisk">*</span>O Produto contém ou pode
            conter ingredientes/aditivos alergênicos?
          </p>
          <label className="container-radio">
            Não
            <Field
              component="input"
              data-testid="alergenicos-nao"
              type="radio"
              value="0"
              name={`alergenicos`}
              validate={required}
              disabled={desabilitar && !atualizacao}
            />
            <span className="checkmark" />
          </label>
          <label className="container-radio">
            Sim
            <Field
              component="input"
              data-testid="alergenicos-sim"
              type="radio"
              value="1"
              name={`alergenicos`}
              validate={required}
              disabled={desabilitar && !atualizacao}
            />
            <span className="checkmark" />
          </label>
        </div>
      </div>
      {values.alergenicos === "1" && (
        <div className="row">
          <div className="col-12">
            <Field
              component={InputText}
              label="Quais ingredientes/aditivos alergênicos? Indicar conforme a RDC Nº727/22, Anvisa."
              name={`ingredientes_alergenicos`}
              className="input-ficha-tecnica"
              required
              validate={required}
              disabled={desabilitar && !atualizacao}
            />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <p className="label-radio">
            <span className="required-asterisk">*</span>O Produto contém glúten?
            Indicar conforme Lei Federal Nº 10.674/03, Anvisa.
          </p>
          <label className="container-radio">
            Não contém glúten
            <Field
              component="input"
              data-testid="gluten-nao"
              type="radio"
              value="0"
              name={`gluten`}
              validate={required}
              disabled={desabilitar && !atualizacao}
            />
            <span className="checkmark" />
          </label>
          <label className="container-radio">
            Contém glúten
            <Field
              component="input"
              data-testid="gluten-sim"
              type="radio"
              value="1"
              name={`gluten`}
              validate={required}
              disabled={desabilitar && !atualizacao}
            />
            <span className="checkmark" />
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <p className="label-radio">
            <span className="required-asterisk">*</span>O Produto contém
            lactose?
          </p>
          <label className="container-radio">
            Não
            <Field
              component="input"
              data-testid="lactose-nao"
              type="radio"
              value="0"
              name={`lactose`}
              validate={required}
              disabled={desabilitar}
            />
            <span className="checkmark" />
          </label>
          <label className="container-radio">
            Sim
            <Field
              component="input"
              data-testid="lactose-sim"
              type="radio"
              value="1"
              name={`lactose`}
              validate={required}
              disabled={desabilitar}
            />
            <span className="checkmark" />
          </label>
        </div>
      </div>
      {values.lactose === "1" && (
        <div className="row">
          <div className="col-12">
            <Field
              component={InputText}
              label="Detalhar: Indicar conforme a RDC Nº 727/22, Anvisa."
              name={`lactose_detalhe`}
              className="input-ficha-tecnica"
              required
              validate={required}
              disabled={desabilitar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPereciveisENaoPereciveis;
