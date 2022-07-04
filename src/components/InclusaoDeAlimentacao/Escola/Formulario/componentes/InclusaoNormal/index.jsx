import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { InputComData } from "components/Shareable/DatePicker";
import InputText from "components/Shareable/Input/InputText";
import { maxLength, required } from "helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  formatarParaMultiselect
} from "helpers/utilities";
import moment from "moment";
import React from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { OnChange } from "react-final-form-listeners";
import "../../style.scss";

export const DataInclusaoNormal = ({ ...props }) => {
  const {
    index,
    pop,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    name,
    setShowModal
  } = props;

  const onDataChanged = value => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="col-4">
        <div className="row">
          <div className={`col-${index > 0 ? "8" : "12"}`}>
            <Field
              component={InputComData}
              name={`${name}.data`}
              //onBlur={event => this.onDataChanged(event.target.value)}
              minDate={proximosDoisDiasUteis}
              maxDate={moment()
                .endOf("year")
                .toDate()}
              label="Dia"
              required
              //validate={this.validaData}
            />
            <OnChange name={`${name}.data`}>
              {value => {
                if (value) {
                  onDataChanged(value);
                }
              }}
            </OnChange>
          </div>
          {index > 0 && (
            <div className="col-4 mt-auto mb-1">
              <Botao
                texto="Remover dia"
                type={BUTTON_TYPE.SUBMIT}
                onClick={() => pop("inclusoes")}
                style={BUTTON_STYLE.BLUE_OUTLINE}
                icon={BUTTON_ICON.TRASH}
                className="botao-remover-dia"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const AdicionarDia = ({ push }) => {
  return (
    <Botao
      className="col-3 mb-3"
      texto="Adicionar dia"
      onClick={() => push("inclusoes")}
      style={BUTTON_STYLE.GREEN_OUTLINE}
      type={BUTTON_TYPE.BUTTON}
    />
  );
};

export const OutroMotivo = ({ name }) => {
  return (
    <div className="mb-3">
      <Field
        component={TextArea}
        label="Qual o motivo?"
        name={`${name}.outro_motivo`}
        required
        validate={composeValidators(required, maxLength(500))}
      />
    </div>
  );
};

export const PeriodosInclusaoNormal = ({ form, values }) => {
  const getPeriodo = indice => {
    return values.quantidades_periodo[indice];
  };

  return (
    <>
      <div className="row">
        <div className="col-3">Período</div>
        <div className="col-6">Tipo de Alimentação</div>
        <div className="col-3">Nº de Alunos</div>
      </div>
      <FieldArray name="quantidades_periodo">
        {({ fields }) =>
          fields.map((name, indice) => (
            <div key={indice}>
              <div className="row">
                <Field
                  component={"input"}
                  type="hidden"
                  name={`${name}.checked`}
                />
                <div className="col-3">
                  <div
                    className={`period-quantity number-${indice} pl-5 pt-2 pb-2`}
                  >
                    <label htmlFor="check" className="checkbox-label">
                      <Field
                        component={"input"}
                        type="checkbox"
                        name={`${name}.checked`}
                      />
                      <span
                        className="checkbox-custom"
                        data-cy={`checkbox-${getPeriodo(indice).nome}`}
                      />{" "}
                      {getPeriodo(indice).nome}
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className={getPeriodo(indice).multiselect}>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_alimentacao"
                      selected={
                        getPeriodo(indice).tipos_alimentacao_selecionados
                      }
                      options={formatarParaMultiselect(
                        getPeriodo(indice).tipos_alimentacao
                      )}
                      onSelectedChanged={values_ => {
                        form.change(
                          `quantidades_periodo[
                            ${indice}].tipos_alimentacao_selecionados`,
                          values_
                        );
                      }}
                      disableSearch={true}
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos"
                      }}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <Field
                    component={InputText}
                    onChange={event =>
                      this.onNumeroAlunosChanged(event, getPeriodo(indice))
                    }
                    disabled={!getPeriodo(indice).checked}
                    type="number"
                    name={`${name}.numero_alunos`}
                    min="0"
                    className="form-control quantidade-aluno"
                    required={getPeriodo(indice).checked}
                    validate={
                      getPeriodo(indice).checked && getPeriodo(indice).validador
                    }
                  />
                </div>
              </div>
            </div>
          ))
        }
      </FieldArray>
    </>
  );
};
