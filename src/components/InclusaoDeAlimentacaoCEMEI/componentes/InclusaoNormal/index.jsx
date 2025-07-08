import React from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import {
  alunosEMEIporPeriodo,
  arrTiposAlimentacaoPorPeriodoETipoUnidade,
  possuiAlunosCEIporPeriodo,
  tiposAlimentacaoPorPeriodoETipoUnidade,
  totalAlunosInputPorPeriodoCEI,
  totalAlunosPorPeriodoCEI,
} from "src/components/InclusaoDeAlimentacaoCEMEI/helpers";
import InputText from "src/components/Shareable/Input/InputText";
import { maxValue, naoPodeSerZero } from "src/helpers/fieldValidators";
import {
  composeValidators,
  formatarParaMultiselect,
} from "src/helpers/utilities";
import "./style.scss";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";

export const PeriodosCEIeouEMEI = ({
  form,
  values,
  vinculos,
  periodos,
  motivoEspecifico,
}) => {
  const getPeriodo = (indice) => {
    return values.quantidades_periodo[indice];
  };

  const onTiposAlimentacaoChanged = (values_, indice) => {
    form.change(
      `quantidades_periodo[
          ${indice}].tipos_alimentacao_selecionados`,
      values_
    );
  };

  return (
    <FieldArray name="quantidades_periodo">
      {({ fields }) =>
        fields.map((name, indice) =>
          motivoEspecifico ? (
            <div className="periodos_cei_emei mt-1 mb-3" key={indice}>
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
                    }}
                    className="checkbox-custom"
                    data-cy={`checkbox-${getPeriodo(indice).nome}`}
                  />{" "}
                  {getPeriodo(indice).nome}
                </label>
              </div>
              {values.quantidades_periodo[indice][`checked`] && (
                <div className="ms-5 me-5">
                  <div className="alunos-label mt-3">Alunos EMEI</div>
                  <div className="tipos-alimentacao mt-3 mb-3 row">
                    Tipos de alimentação do período {getPeriodo(indice).nome}:{" "}
                    <div className="col-4">
                      <Field
                        component={StatefulMultiSelect}
                        name="tipos_alimentacao"
                        selected={
                          getPeriodo(indice).tipos_alimentacao_selecionados ||
                          []
                        }
                        options={formatarParaMultiselect(
                          getPeriodo(indice).tipos_alimentacao
                        )}
                        onSelectedChanged={(values_) =>
                          onTiposAlimentacaoChanged(values_, indice)
                        }
                        disableSearch={true}
                        overrideStrings={{
                          selectSomeItems: "Selecione",
                          allItemsAreSelected:
                            "Todos os itens estão selecionados",
                          selectAll: "Todos",
                        }}
                      />
                    </div>
                  </div>
                  <table className="faixas-etarias-cei w-50">
                    <thead>
                      <tr className="row">
                        <th className="col-6 d-flex justify-content-center">
                          <span className="my-auto">Quantidade</span>
                          <Field
                            className="ms-3"
                            component={InputText}
                            type="number"
                            name={`${name}.alunos_emei`}
                            validate={
                              getPeriodo(indice).checked &&
                              composeValidators(naoPodeSerZero)
                            }
                          />
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="periodos_cei_emei mt-1 mb-3" key={indice}>
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
                    }}
                    className="checkbox-custom"
                    data-cy={`checkbox-${getPeriodo(indice).nome}`}
                  />{" "}
                  {getPeriodo(indice).nome}
                </label>
              </div>
              {values.quantidades_periodo[indice][`checked`] && (
                <>
                  {possuiAlunosCEIporPeriodo(
                    getPeriodo(indice).nome,
                    periodos
                  ) &&
                    !motivoEspecifico && (
                      <>
                        <div className="ms-5 me-5">
                          <div className="alunos-label mt-3">Alunos CEI</div>
                          <div className="tipos-alimentacao mt-3 mb-3">
                            Tipos de alimentação do período{" "}
                            {getPeriodo(indice).nome}:{" "}
                            <span>
                              {tiposAlimentacaoPorPeriodoETipoUnidade(
                                vinculos,
                                getPeriodo(indice).nome,
                                "CEI"
                              )}
                            </span>
                          </div>
                          <table className="faixas-etarias-cei">
                            <thead>
                              <tr className="row">
                                <th className="col-8">Faixa Etária</th>
                                <th className="col-2 text-center">
                                  Alunos matriculados
                                </th>
                                <th className="col-2 text-center">
                                  Quantidade
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.quantidades_periodo[indice].CEI.map(
                                (faixa, key) => {
                                  return (
                                    <tr key={key} className="row">
                                      <td className="col-8">{faixa.faixa}</td>
                                      <td className="col-2 text-center">
                                        {faixa.quantidade_alunos}
                                      </td>
                                      <td className="col-2 text-center">
                                        <Field
                                          component={InputText}
                                          dataTestIdDiv={`${name}.faixas.${key}`}
                                          type="number"
                                          name={`${name}.faixas.${faixa.faixa}`}
                                          validate={
                                            getPeriodo(indice).checked &&
                                            composeValidators(
                                              naoPodeSerZero,
                                              maxValue(faixa.quantidade_alunos)
                                            )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                              <tr className="row">
                                <td className="col-8 fw-bold">Total</td>
                                <td className="col-2 text-center">
                                  {totalAlunosPorPeriodoCEI(
                                    periodos,
                                    getPeriodo(indice).nome
                                  )}
                                </td>
                                <td className="col-2 text-center">
                                  {totalAlunosInputPorPeriodoCEI(
                                    values,
                                    getPeriodo(indice).nome
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  {alunosEMEIporPeriodo(getPeriodo(indice).nome, periodos) >
                    0 && (
                    <>
                      <div className="ms-5 me-5">
                        <div className="alunos-label mt-3">Alunos EMEI</div>
                        <div className="tipos-alimentacao mt-3 mb-3 row">
                          Tipos de alimentação do período{" "}
                          {getPeriodo(indice).nome}:{" "}
                          <div className="col-4">
                            <Field
                              component={MultiselectRaw}
                              name="tipos_alimentacao"
                              dataTestId={`select-tipos-alimentacao`}
                              selected={
                                getPeriodo(indice)
                                  .tipos_alimentacao_selecionados || []
                              }
                              options={formatarParaMultiselect(
                                arrTiposAlimentacaoPorPeriodoETipoUnidade(
                                  vinculos,
                                  getPeriodo(indice).nome,
                                  "EMEI"
                                )
                              )}
                              onSelectedChanged={(values_) => {
                                form.change(
                                  `quantidades_periodo[
          ${indice}].tipos_alimentacao_selecionados`,
                                  values_.map((value_) => value_.value)
                                );
                              }}
                              placeholder="Selecione tipos de alimentação"
                            />
                          </div>
                        </div>
                        <table
                          className={`faixas-etarias-cei ${
                            motivoEspecifico ? "w-50" : ""
                          }`}
                        >
                          <thead>
                            <tr className="row">
                              {!motivoEspecifico && (
                                <th className="col-8 my-auto">
                                  Alunos matriculados:{" "}
                                  <span className="fw-normal">
                                    {alunosEMEIporPeriodo(
                                      getPeriodo(indice).nome,
                                      periodos
                                    )}
                                  </span>
                                </th>
                              )}
                              <th
                                className={`${
                                  motivoEspecifico ? "col-6" : "col-4"
                                } d-flex justify-content-center`}
                              >
                                <span className="my-auto">Quantidade</span>
                                <Field
                                  className="ms-3"
                                  component={InputText}
                                  dataTestIdDiv={`${name}.alunos_emei`}
                                  type="number"
                                  name={`${name}.alunos_emei`}
                                  validate={
                                    getPeriodo(indice).checked &&
                                    composeValidators(
                                      naoPodeSerZero,
                                      maxValue(
                                        alunosEMEIporPeriodo(
                                          getPeriodo(indice).nome,
                                          periodos
                                        )
                                      )
                                    )
                                  }
                                />
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )
        )
      }
    </FieldArray>
  );
};
