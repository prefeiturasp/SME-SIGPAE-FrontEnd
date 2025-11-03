import HTTP_STATUS from "http-status-codes";
import { Fragment } from "react";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { deepCopy, usuarioEhDRE } from "src/helpers/utilities";
import { filtrarAlunosMatriculados } from "src/services/alunosMatriculados.service";
import { formataOpcoes, formataOpcoesDropdown } from "../../helpers";

export const Filtros = ({ ...props }) => {
  const {
    dres,
    lotes,
    tiposUnidades,
    unidadesEducacionais,
    tiposTurmas,
    listaOpcoes,
    setFiltrando,
    setFiltros,
    setPage,
    setResultado,
    setTotal,
    setShowPeriodosFaixas,
  } = props;

  const onSubmit = async (values) => {
    setFiltrando(true);
    let _values = deepCopy(values);
    const page = 1;
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setFiltros(values);
    setPage(1);
    const response = await filtrarAlunosMatriculados(_values);
    if (response.status === HTTP_STATUS.OK) {
      setTotal(response.data.count);
      setResultado(response.data.results);
      setShowPeriodosFaixas(formataOpcoesDropdown(response.data.results));
    } else {
      toastError(
        "Houve um erro ao filtrar alunos matriculados, tente novamente mais tarde",
      );
    }
    setFiltrando(false);
  };

  const filtrarOpcoesEscola = (values) => {
    let escolas = listaOpcoes.escolas;
    if (values.diretorias_regionais?.length) {
      escolas = escolas.filter((escola) =>
        values.diretorias_regionais.includes(escola.diretoria_regional.uuid),
      );
    }
    if (values.lotes?.length) {
      escolas = escolas.filter((escola) =>
        values.lotes.includes(escola.lote.uuid),
      );
    }
    if (values.tipos_unidades?.length) {
      escolas = escolas.filter((escola) =>
        values.tipos_unidades.includes(escola.tipo_unidade.uuid),
      );
    }
    return formataOpcoes(escolas);
  };

  const naoHaEscolasParaOsFiltrosSelecionados = (values) => {
    return (
      values.tipos_unidades?.length > 0 &&
      filtrarOpcoesEscola(values).length === 0
    );
  };

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        {({ form, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            {usuarioEhDRE() ? (
              <>
                <div className="row">
                  <div className="col-2">
                    <Field
                      label="Lote"
                      component={MultiselectRaw}
                      name="lotes"
                      dataTestId="select-lotes"
                      placeholder="Selecione os lotes"
                      selected={values.lotes || []}
                      options={lotes}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "lotes",
                          values_.map((value_) => value_.value),
                        );
                        form.change("unidades_educacionais", []);
                      }}
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      label="Tipo de Unidade"
                      component={MultiselectRaw}
                      name="tipos_unidades"
                      dataTestId="select-tipos-unidades"
                      selected={values.tipos_unidades || []}
                      options={tiposUnidades}
                      onSelectedChanged={(values_) =>
                        form.change(
                          "tipos_unidades",
                          values_.map((value_) => value_.value),
                        )
                      }
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      label="Tipo de Turma"
                      component={MultiselectRaw}
                      name="tipos_turmas"
                      dataTestId="select-tipos-turmas"
                      selected={values.tipos_turmas || []}
                      options={tiposTurmas}
                      onSelectedChanged={(values_) =>
                        form.change(
                          "tipos_turmas",
                          values_.map((value_) => value_.value),
                        )
                      }
                    />
                  </div>
                  <div className="col-4 my-auto">
                    <div className="helper-grid-alunos-matriculados">
                      {naoHaEscolasParaOsFiltrosSelecionados(values) &&
                        "Não existem resultados para os filtros selecionados."}
                    </div>
                    {!naoHaEscolasParaOsFiltrosSelecionados(values) && (
                      <Field
                        label="Unidade Educacional"
                        dataTestId="select-unidades-educacionais"
                        component={MultiselectRaw}
                        name="unidades_educacionais"
                        selected={values.unidades_educacionais || []}
                        options={
                          values.diretorias_regionais?.length ||
                          values.lotes?.length ||
                          values.tipos_unidades?.length
                            ? filtrarOpcoesEscola(values)
                            : unidadesEducacionais
                        }
                        onSelectedChanged={(values_) =>
                          form.change(
                            "unidades_educacionais",
                            values_.map((value_) => value_.value),
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-4">
                    <Field
                      label="DRE"
                      dataTestId="select-dres"
                      component={MultiselectRaw}
                      name="diretorias_regionais"
                      placeholder="Selecione as DREs"
                      selected={
                        values.diretorias_regionais ||
                        (dres.length === 1 ? [dres[0].value] : [])
                      }
                      options={dres}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "diretorias_regionais",
                          values_.map((value_) => value_.value),
                        );
                        form.change("lotes", []);
                        form.change("unidades_educacionais", []);
                      }}
                      disabled={dres.length === 1}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      label="Lote"
                      component={MultiselectRaw}
                      name="lotes"
                      dataTestId="select-lotes"
                      placeholder="Selecione os lotes"
                      selected={
                        values.lotes ||
                        (lotes.length === 1 ? [lotes[0].value] : [])
                      }
                      options={
                        values.diretorias_regionais?.length
                          ? formataOpcoes(
                              listaOpcoes.lotes.filter((lote) =>
                                values.diretorias_regionais.includes(
                                  lote.diretoria_regional.uuid,
                                ),
                              ),
                            )
                          : lotes
                      }
                      onSelectedChanged={(values_) => {
                        form.change(
                          "lotes",
                          values_.map((value_) => value_.value),
                        );
                        form.change("unidades_educacionais", []);
                      }}
                      disabled={lotes.length === 1}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      label="Tipo de Unidade"
                      component={MultiselectRaw}
                      dataTestId="select-tipos-unidades"
                      name="tipos_unidades"
                      selected={
                        values.tipos_unidades ||
                        (tiposUnidades.length === 1
                          ? [tiposUnidades[0].value]
                          : [])
                      }
                      options={tiposUnidades}
                      onSelectedChanged={(values_) =>
                        form.change(
                          "tipos_unidades",
                          values_.map((value_) => value_.value),
                        )
                      }
                      disabled={tiposUnidades.length === 1}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-8 my-auto">
                    <div className="helper-grid-alunos-matriculados">
                      {naoHaEscolasParaOsFiltrosSelecionados(values) &&
                        "Não existem resultados para os filtros selecionados."}
                    </div>
                    {!naoHaEscolasParaOsFiltrosSelecionados(values) && (
                      <Field
                        label="Unidade Educacional"
                        component={MultiselectRaw}
                        dataTestId="select-unidades-educacionais"
                        name="unidades_educacionais"
                        selected={
                          values.unidades_educacionais ||
                          (unidadesEducacionais.length === 1
                            ? [unidadesEducacionais[0].value]
                            : [])
                        }
                        options={
                          values.diretorias_regionais?.length ||
                          values.lotes?.length ||
                          values.tipos_unidades?.length
                            ? filtrarOpcoesEscola(values)
                            : unidadesEducacionais
                        }
                        onSelectedChanged={(values_) =>
                          form.change(
                            "unidades_educacionais",
                            values_.map((value_) => value_.value),
                          )
                        }
                        disabled={unidadesEducacionais.length === 1}
                      />
                    )}
                  </div>
                  <div className="col-4">
                    <Field
                      label="Tipo de Turma"
                      component={MultiselectRaw}
                      dataTestId="select-tipos-turmas"
                      name="tipos_turmas"
                      selected={values.tipos_turmas || []}
                      options={tiposTurmas}
                      onSelectedChanged={(values_) =>
                        form.change(
                          "tipos_turmas",
                          values_.map((value_) => value_.value),
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}
            <div className="row mt-3">
              <div className="col-12 text-end">
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    form.reset();
                    setResultado(undefined);
                    setTotal(undefined);
                    setShowPeriodosFaixas([]);
                  }}
                />
                <Botao
                  texto="Consultar"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
                />
              </div>
            </div>
          </form>
        )}
      </Form>
    </Fragment>
  );
};
