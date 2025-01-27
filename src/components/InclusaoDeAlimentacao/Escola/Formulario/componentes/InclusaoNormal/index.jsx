import React from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { InputComData } from "components/Shareable/DatePicker";
import InputText from "components/Shareable/Input/InputText";
import CKEditorField from "components/Shareable/CKEditorField";
import {
  dataDuplicada,
  maxLength,
  maxValue,
  naoPodeSerZero,
  numericInteger,
  required,
} from "helpers/fieldValidators";
import {
  composeValidators,
  fimDoCalendario,
  formatarParaMultiselect,
} from "helpers/utilities";
import "../../style.scss";

export const DataInclusaoNormal = ({ ...props }) => {
  const {
    index,
    form,
    proximosDoisDiasUteis,
    name,
    values,
    onDataChanged,
    nameFieldArray,
  } = props;

  return (
    <>
      <div className="col-6">
        <div className="row">
          <div className={`col-${index > 0 ? "9" : "12"}`}>
            <Field
              component={InputComData}
              name={`${name}.data`}
              minDate={proximosDoisDiasUteis}
              maxDate={fimDoCalendario()}
              label="Dia"
              required
              validate={composeValidators(
                required,
                dataDuplicada(values[nameFieldArray || "inclusoes"])
              )}
              inputOnChange={(value) => {
                if (value) {
                  onDataChanged(value);
                }
              }}
              dataTestId={`data-motivo-normal-${index}`}
            />
          </div>
          {index > 0 && (
            <div className="col-3 mt-auto mb-1">
              <Botao
                texto="Remover dia"
                type={BUTTON_TYPE.BUTTON}
                onClick={() =>
                  form.change(
                    nameFieldArray || "inclusoes",
                    values[nameFieldArray || "inclusoes"].filter(
                      (_, i) => i !== index
                    )
                  )
                }
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

export const AdicionarDia = ({ push, nameFieldArray }) => {
  return (
    <Botao
      className="col-3 mb-3"
      texto="Adicionar dia"
      onClick={() => push(nameFieldArray || "inclusoes")}
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

export const EventoEspecifico = ({ name }) => {
  return (
    <div className="mb-3">
      <Field
        component={TextArea}
        label="Descrição do Evento"
        name={`${name}.evento`}
        required
        validate={composeValidators(required, maxLength(1500))}
      />
    </div>
  );
};

export const PeriodosInclusaoNormal = ({
  form,
  values,
  periodos,
  meusDados,
  ehETEC,
  motivoEspecifico,
  uuid,
  idExterno,
}) => {
  const getPeriodo = (indice) => {
    return values.quantidades_periodo[indice];
  };
  form.change("uuid", uuid);
  form.change("id_externo", idExterno);
  const onTiposAlimentacaoChanged = (values_, indice) => {
    if (ehETEC) {
      const LANCHE_4H_UUID = periodos[0].tipos_alimentacao.find(
        (ta) => ta.nome === "Lanche 4h"
      ).uuid;
      const LANCHE_EMERGENCIAL = periodos[0].tipos_alimentacao.find(
        (ta) => ta.nome === "Lanche Emergencial"
      ).uuid;
      const NOT_LANCHE_4H_OR_EMERGENCIAL_UUID_ARRAY =
        periodos[0].tipos_alimentacao
          .filter(
            (ta) => ![LANCHE_4H_UUID, LANCHE_EMERGENCIAL].includes(ta.uuid)
          )
          .map((ta) => ta.uuid);
      if (values_.at(-1) === LANCHE_4H_UUID) {
        form.change(
          `quantidades_periodo[
        ${indice}].tipos_alimentacao_selecionados`,
          [LANCHE_4H_UUID]
        );
      } else if (values_.at(-1) === LANCHE_EMERGENCIAL) {
        form.change(
          `quantidades_periodo[
        ${indice}].tipos_alimentacao_selecionados`,
          [LANCHE_EMERGENCIAL]
        );
      } else if (
        !values_.at(-1) ||
        values.quantidades_periodo[
          indice
        ].tipos_alimentacao_selecionados.includes(values_.at(-1))
      ) {
        form.change(
          `quantidades_periodo[
        ${indice}].tipos_alimentacao_selecionados`,
          []
        );
      } else if (
        NOT_LANCHE_4H_OR_EMERGENCIAL_UUID_ARRAY.includes(values_.at(-1))
      ) {
        form.change(
          `quantidades_periodo[
        ${indice}].tipos_alimentacao_selecionados`,
          NOT_LANCHE_4H_OR_EMERGENCIAL_UUID_ARRAY
        );
      }
    } else {
      form.change(
        `quantidades_periodo[
            ${indice}].tipos_alimentacao_selecionados`,
        values_
      );
    }
  };

  const validacaoNumeroAlunos = (periodos, indice) => {
    return motivoEspecifico
      ? composeValidators(naoPodeSerZero, numericInteger)
      : composeValidators(
          naoPodeSerZero,
          numericInteger,
          maxValue(
            periodos.find((p) => p.uuid === getPeriodo(indice).uuid) &&
              periodos.find((p) => p.uuid === getPeriodo(indice).uuid)
                .maximo_alunos
          )
        );
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
            <div className="mt-1" key={indice}>
              <div className="row">
                <div className="col-3">
                  <div
                    className={`period-quantity number-${indice} ps-5 pt-2 pb-2`}
                    data-testid={`div-checkbox-${getPeriodo(indice).nome}`}
                  >
                    <label htmlFor="check" className="checkbox-label">
                      <Field
                        component={"input"}
                        type="checkbox"
                        name={`${name}.checked`}
                      />
                      <span
                        onClick={async () => {
                          await form.change(
                            `${name}.checked`,
                            !values.quantidades_periodo[indice][`checked`]
                          );
                          await form.change(
                            `${name}.multiselect`,
                            !values.quantidades_periodo[indice][`checked`]
                              ? "multiselect-wrapper-enabled"
                              : "multiselect-wrapper-disabled"
                          );
                        }}
                        className="checkbox-custom"
                        data-cy={`checkbox-${getPeriodo(indice).nome}`}
                      />{" "}
                      {getPeriodo(indice).nome}
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className={getPeriodo(indice).multiselect}
                    data-testid={`multiselect-div-${getPeriodo(indice).nome}`}
                  >
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_alimentacao"
                      selected={
                        getPeriodo(indice).tipos_alimentacao_selecionados || []
                      }
                      options={formatarParaMultiselect(
                        getPeriodo(indice).tipos_alimentacao || []
                      )}
                      onSelectedChanged={(values_) =>
                        onTiposAlimentacaoChanged(values_, indice)
                      }
                      disableSearch={true}
                      hasSelectAll={!ehETEC}
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                </div>
                <div className="col-3">
                  <Field
                    component={InputText}
                    disabled={!getPeriodo(indice).checked}
                    type="number"
                    name={`${name}.numero_alunos`}
                    min="0"
                    className="form-control quantidade-aluno"
                    required={getPeriodo(indice).checked}
                    dataTestIdDiv={`numero-alunos-${indice}`}
                    validate={
                      meusDados.vinculo_atual.instituicao
                        .tipo_unidade_escolar_iniciais !== "CEU GESTAO"
                        ? getPeriodo(indice).checked &&
                          validacaoNumeroAlunos(periodos, indice)
                        : false
                    }
                  />
                </div>
              </div>
              {ehETEC && (
                <Field
                  component={CKEditorField}
                  label="Observações"
                  validate={maxLength(1000)}
                  name={`${name}.observacao`}
                />
              )}
            </div>
          ))
        }
      </FieldArray>
    </>
  );
};
