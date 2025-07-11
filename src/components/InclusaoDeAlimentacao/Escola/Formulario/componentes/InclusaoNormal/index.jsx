import React, { useEffect } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Select from "src/components/Shareable/Select";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import InputText from "src/components/Shareable/Input/InputText";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  dataDuplicada,
  maxLength,
  maxValue,
  naoPodeSerZero,
  numericInteger,
  required,
} from "src/helpers/fieldValidators";
import {
  agregarDefault,
  composeValidators,
  fimDoCalendario,
  formatarParaMultiselect,
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "src/helpers/utilities";
import { renderizaSelectSimples } from "../../../../helper";
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
                dataTestId={`botao-remover-dia-${index}`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const AdicionarDia = ({ push, nameFieldArray = undefined }) => {
  return (
    <Botao
      className="col-3 mb-3"
      texto="Adicionar dia"
      onClick={() => push(nameFieldArray || "inclusoes")}
      style={BUTTON_STYLE.GREEN_OUTLINE}
      type={BUTTON_TYPE.BUTTON}
      dataTestId="botao-adicionar-dia"
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
  ehETEC = false,
  motivoEspecifico,
  uuid,
  idExterno,
}) => {
  const getPeriodo = (indice) => {
    return values.quantidades_periodo[indice];
  };
  useEffect(() => {
    form.change("uuid", uuid);
    form.change("id_externo", idExterno);
  }, [form, uuid, idExterno]);

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
  const handleNumeroAlunosValidate = (motivoEspecifico, periodos, indice) => {
    return motivoEspecifico ||
      usuarioEhEscolaCeuGestao() ||
      usuarioEhEscolaCMCT()
      ? composeValidators(naoPodeSerZero, numericInteger, required)
      : composeValidators(
          naoPodeSerZero,
          numericInteger,
          required,
          maxValue(
            periodos.find((p) => p.uuid === getPeriodo(indice).uuid)
              ?.maximo_alunos
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
                  {renderizaSelectSimples(getPeriodo(indice).nome) ? (
                    // Renderiza um select simples se for CMCT
                    <div
                      data-testid={`select-simples-div-${
                        getPeriodo(indice).nome
                      }`}
                    >
                      <Field
                        component={Select}
                        name={`${name}.tipos_alimentacao_selecionados`}
                        options={[
                          ...agregarDefault(
                            getPeriodo(indice).tipos_alimentacao
                          ),
                          {
                            nome: "Refeição e Sobremesa",
                            uuid: "refeicao_e_sobremesa",
                          },
                        ]}
                        naoDesabilitarPrimeiraOpcao
                        disabled={!getPeriodo(indice).checked}
                      />
                    </div>
                  ) : (
                    // Renderiza o StatefulMultiSelect caso contrário
                    <div
                      className={getPeriodo(indice).multiselect}
                      data-testid={`multiselect-div-${getPeriodo(indice).nome}`}
                    >
                      <Field
                        component={StatefulMultiSelect}
                        name="tipos_alimentacao"
                        selected={
                          getPeriodo(indice).tipos_alimentacao_selecionados ||
                          []
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
                  )}
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
                      getPeriodo(indice).checked &&
                      handleNumeroAlunosValidate(
                        motivoEspecifico,
                        periodos,
                        indice
                      )
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
