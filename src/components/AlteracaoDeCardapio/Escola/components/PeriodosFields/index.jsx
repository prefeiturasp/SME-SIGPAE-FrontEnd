import { InputText } from "components/Shareable/Input/InputText";
import { MultiselectRaw } from "components/Shareable/MultiselectRaw";
import {
  composeValidators,
  maxValue,
  naoPodeSerZero,
  required,
} from "helpers/fieldValidators";
import {
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "helpers/utilities";
import React, { Fragment } from "react";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";

export const PeriodosFields = ({ ...props }) => {
  const { ehMotivoPorNome, periodos, form, values } = props;

  const exibeApenasPorNome = (tiposAlimentacao, nome) => {
    return tiposAlimentacao.filter((tp) => tp.label.includes(nome));
  };

  const removePorNome = (tiposAlimentacao, nome) => {
    return tiposAlimentacao.filter((tp) => !tp.label.includes(nome));
  };

  const handleTiposAlimentacaoDe = (tiposAlimentacao, values) => {
    if (ehMotivoPorNome("Lanche Emergencial", values))
      return removePorNome(tiposAlimentacao, "Lanche Emergencial");
    else if (ehMotivoPorNome("LPR", values)) {
      return removePorNome(
        exibeApenasPorNome(tiposAlimentacao, "Lanche"),
        "Lanche Emergencial"
      );
    } else if (ehMotivoPorNome("RPL", values)) {
      return removePorNome(tiposAlimentacao, "Lanche");
    }
    return tiposAlimentacao;
  };

  const handleTiposAlimentacaoPara = (tiposAlimentacao, values) => {
    if (ehMotivoPorNome("Lanche Emergencial", values))
      return exibeApenasPorNome(tiposAlimentacao, "Lanche Emergencial");
    else if (ehMotivoPorNome("LPR", values)) {
      return removePorNome(tiposAlimentacao, "Lanche");
    } else if (ehMotivoPorNome("RPL", values)) {
      return removePorNome(
        exibeApenasPorNome(tiposAlimentacao, "Lanche"),
        "Lanche Emergencial"
      );
    }
    return tiposAlimentacao;
  };

  const handleNumeroAlunosValidate = (index) => {
    return usuarioEhEscolaCeuGestao() || usuarioEhEscolaCMCT()
      ? composeValidators(naoPodeSerZero, required)
      : composeValidators(
          naoPodeSerZero,
          required,
          maxValue(getPeriodo(index).maximo_alunos)
        );
  };

  const getPeriodo = (index) => {
    return periodos[index];
  };

  return (
    <section>
      <div className="row mt-3 mb-3 g-0">
        <div className="col-3 pe-3">Período</div>
        <div className="col-3 pe-3">Alterar alimentação de:</div>
        <div className="col-3 pe-3">Para alimentação:</div>
        <div className="col-3">Nº de Alunos</div>
      </div>
      <FieldArray name="substituicoes">
        {({ fields }) =>
          fields.map((name, index) => (
            <div className="row g-0" key={index}>
              <div className="col-3 pe-3">
                <div
                  className={`period-quantity number-${index} ps-5 pt-2 pb-2`}
                >
                  <Fragment>
                    <label htmlFor="check" className="checkbox-label">
                      <Field
                        component={"input"}
                        type="checkbox"
                        name={`${name}.check`}
                      />
                      <span
                        onClick={() => {
                          form.change(
                            `${name}.check`,
                            !values.substituicoes[index]["check"]
                          );
                        }}
                        className="checkbox-custom"
                        data-cy={`checkbox-${getPeriodo(index).nome}`}
                      />
                      <div className=""> {getPeriodo(index).nome}</div>
                    </label>
                  </Fragment>
                </div>
              </div>
              <div className="col-3 pe-3">
                <Field
                  component={MultiselectRaw}
                  name={`${name}.tipos_alimentacao_de`}
                  selected={
                    form.getState().values.substituicoes[index]
                      .tipos_alimentacao_de_selecionados || []
                  }
                  options={handleTiposAlimentacaoDe(
                    getPeriodo(index).tipos_alimentacao.map(
                      (tipo_alimentacao) => ({
                        label: tipo_alimentacao.nome,
                        value: tipo_alimentacao.uuid,
                      })
                    ),
                    values
                  )}
                  onSelectedChanged={(values_) => {
                    form.change(
                      `substituicoes[${index}].tipos_alimentacao_de_selecionados`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                  placeholder="Selecione tipos de alimentação"
                  disabled={!values.substituicoes[index]["check"]}
                  required={values.substituicoes[index]["check"]}
                />
              </div>
              <div className="col-3 pe-3">
                <Field
                  component={MultiselectRaw}
                  name={`${name}.tipos_alimentacao_para`}
                  selected={
                    values.substituicoes[index]
                      .tipos_alimentacao_para_selecionados || []
                  }
                  required={values.substituicoes[index]["check"]}
                  options={handleTiposAlimentacaoPara(
                    getPeriodo(index).tipos_alimentacao.map(
                      (tipo_alimentacao) => ({
                        label: tipo_alimentacao.nome,
                        value: tipo_alimentacao.uuid,
                      })
                    ),
                    values
                  )}
                  onSelectedChanged={(values_) => {
                    form.change(
                      `substituicoes[${index}].tipos_alimentacao_para_selecionados`,
                      values_.map((value_) => value_.value)
                    );
                  }}
                  placeholder="Selecione tipos de alimentação"
                  disabled={!values.substituicoes[index]["check"]}
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputText}
                  disabled={!values.substituicoes[index]["check"]}
                  type="number"
                  name={`${name}.qtd_alunos`}
                  min="0"
                  step="1"
                  required={values.substituicoes[index]["check"]}
                  validate={
                    values.substituicoes[index]["check"] &&
                    handleNumeroAlunosValidate(index)
                  }
                />
              </div>
            </div>
          ))
        }
      </FieldArray>
    </section>
  );
};
