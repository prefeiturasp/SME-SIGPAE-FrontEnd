import { InputText } from "src/components/Shareable/Input/InputText";
import { Select } from "src/components/Shareable/Select";
import {
  composeValidators,
  maxValue,
  naoPodeSerZero,
  required,
} from "src/helpers/fieldValidators";
import {
  agregarDefault,
  usuarioEhEscolaSemAlunosRegulares,
} from "src/helpers/utilities";
import { Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { agruparRefeicaoESobremesa } from "../../helper";

export const PeriodosFields = ({ ...props }) => {
  const { ehMotivoPorNome, periodos, form, values } = props;

  const exibeApenasPorNome = (tiposAlimentacao, nome) => {
    return tiposAlimentacao.filter((tp) => tp.nome.includes(nome));
  };

  const removePorNome = (tiposAlimentacao, nome) => {
    return tiposAlimentacao.filter((tp) => !tp.nome.includes(nome));
  };

  const getOpcoes = (index) => {
    const tiposAlimentacao = getPeriodo(index).tipos_alimentacao.map(
      (tipo_alimentacao) => ({
        nome: tipo_alimentacao.nome,
        uuid: tipo_alimentacao.uuid,
      }),
    );
    return agruparRefeicaoESobremesa(tiposAlimentacao);
  };

  const handleTiposAlimentacaoDe = (tiposAlimentacao, values) => {
    if (ehMotivoPorNome("Lanche Emergencial", values))
      return removePorNome(tiposAlimentacao, "Lanche Emergencial");
    else if (ehMotivoPorNome("LPR", values)) {
      return removePorNome(
        exibeApenasPorNome(tiposAlimentacao, "Lanche"),
        "Lanche Emergencial",
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
        "Lanche Emergencial",
      );
    }
    return tiposAlimentacao;
  };

  const handleNumeroAlunosValidate = (index) => {
    return usuarioEhEscolaSemAlunosRegulares()
      ? composeValidators(naoPodeSerZero, required)
      : composeValidators(
          naoPodeSerZero,
          required,
          maxValue(getPeriodo(index).maximo_alunos),
        );
  };

  const getPeriodo = (index) => {
    return periodos[index];
  };

  const handlePeriodoOnClick = (name, index) => {
    form.change(`${name}.check`, !values.substituicoes[index]["check"]);
    if (values.substituicoes[index]["check"]) {
      form.change(`substituicoes[${index}].tipos_alimentacao_de`, undefined);
      form.change(`substituicoes[${index}].tipos_alimentacao_para`, undefined);
      form.change(`substituicoes[${index}].qtd_alunos`, undefined);
    }
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
                  data-testid={`div-checkbox-${getPeriodo(index).nome}`}
                >
                  <label htmlFor="check" className="checkbox-label">
                    <Field
                      component={"input"}
                      type="checkbox"
                      name={`${name}.check`}
                    />
                    <span
                      onClick={() => handlePeriodoOnClick(name, index)}
                      className="checkbox-custom"
                      data-cy={`checkbox-${getPeriodo(index).nome}`}
                      role="checkbox"
                      tabIndex={0}
                      aria-checked={values.substituicoes[index]["check"]}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePeriodoOnClick(name, index);
                        }
                      }}
                    />
                    <div className=""> {getPeriodo(index).nome}</div>
                  </label>
                </div>
              </div>
              <div className="col-3 pe-3">
                <Field
                  component={Select}
                  dataTestId={`select-tipos-alimentacao-de-${
                    getPeriodo(index).nome
                  }`}
                  name={`${name}.tipos_alimentacao_de`}
                  options={agregarDefault(
                    handleTiposAlimentacaoDe(getOpcoes(index), values),
                  )}
                  naoDesabilitarPrimeiraOpcao
                  disabled={!values.substituicoes[index]["check"]}
                  required={values.substituicoes[index]["check"]}
                  validate={(value, allValues) =>
                    allValues.substituicoes[index]?.check
                      ? required(value)
                      : undefined
                  }
                />
              </div>
              <div className="col-3 pe-3">
                <Field
                  component={Select}
                  dataTestId={`select-tipos-alimentacao-para-${
                    getPeriodo(index).nome
                  }`}
                  name={`${name}.tipos_alimentacao_para`}
                  options={agregarDefault(
                    handleTiposAlimentacaoPara(getOpcoes(index), values),
                  )}
                  naoDesabilitarPrimeiraOpcao
                  required={values.substituicoes[index]["check"]}
                  disabled={!values.substituicoes[index]["check"]}
                  validate={(value, allValues) =>
                    allValues.substituicoes[index]?.check
                      ? required(value)
                      : undefined
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputText}
                  dataTestIdDiv={`div-input-numero-alunos-${
                    getPeriodo(index).nome
                  }`}
                  disabled={!values.substituicoes[index]["check"]}
                  type="number"
                  name={`${name}.qtd_alunos`}
                  min="0"
                  step="1"
                  required={values.substituicoes[index]["check"]}
                  validate={(value, allValues) =>
                    allValues.substituicoes[index]?.check
                      ? handleNumeroAlunosValidate(index)(value)
                      : undefined
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
