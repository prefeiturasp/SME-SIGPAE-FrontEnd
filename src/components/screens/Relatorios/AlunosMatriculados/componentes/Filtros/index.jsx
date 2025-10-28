import React, { Fragment } from "react";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import HTTP_STATUS from "http-status-codes";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { formataOpcoes } from "../../helpers";
import { filtrarAlunosMatriculados } from "src/services/alunosMatriculados.service";
import { deepCopy, usuarioEhDRE } from "src/helpers/utilities";
import { formataOpcoesDropdown } from "../../helpers";

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
        "Houve um erro ao filtrar alunos matriculados, tente novamente mais tarde"
      );
    }
    setFiltrando(false);
  };

  const filtrarOpcoesEscola = (values) => {
    let escolas = listaOpcoes.escolas;
    if (values.diretorias_regionais && values.diretorias_regionais.length) {
      escolas = escolas.filter((escola) =>
        values.diretorias_regionais.includes(escola.diretoria_regional.uuid)
      );
    }
    if (values.lotes && values.lotes.length) {
      escolas = escolas.filter((escola) =>
        values.lotes.includes(escola.lote.uuid)
      );
    }
    return formataOpcoes(escolas);
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
                    <label>Lote</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="lotes"
                      selected={values.lotes || []}
                      options={
                        values.diretorias_regionais &&
                        values.diretorias_regionais.length
                          ? formataOpcoes(
                              listaOpcoes.lotes.filter((lote) =>
                                values.diretorias_regionais.includes(
                                  lote.diretoria_regional.uuid
                                )
                              )
                            )
                          : lotes
                      }
                      onSelectedChanged={(values_) => {
                        form.change("lotes", values_);
                        form.change("unidades_educacionais", []);
                      }}
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os lotes",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                  <div className="col-2">
                    <label>Tipo de Unidade</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_unidades"
                      selected={values.tipos_unidades || []}
                      options={tiposUnidades}
                      onSelectedChanged={(values_) =>
                        form.change("tipos_unidades", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os Tipos de Unidades",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                  <div className="col-2">
                    <label>Tipo de Turma</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_turmas"
                      selected={values.tipos_turmas || []}
                      options={tiposTurmas}
                      onSelectedChanged={(values_) =>
                        form.change("tipos_turmas", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os Tipos de Turmas",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label>Unidade Educacional</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="unidades_educacionais"
                      selected={values.unidades_educacionais || []}
                      options={
                        (values.diretorias_regionais &&
                          values.diretorias_regionais.length) ||
                        (values.lotes && values.lotes.length)
                          ? filtrarOpcoesEscola(values)
                          : unidadesEducacionais
                      }
                      onSelectedChanged={(values_) =>
                        form.change("unidades_educacionais", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todas as Unidades Educacionais",
                        selectAll: "Todas",
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-4">
                    <label>DRE</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="diretorias_regionais"
                      selected={values.diretorias_regionais || []}
                      options={dres}
                      onSelectedChanged={(values_) => {
                        form.change("diretorias_regionais", values_);
                        form.change("lotes", []);
                        form.change("unidades_educacionais", []);
                      }}
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todas as DREs",
                        selectAll: "Todas",
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Lote</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="lotes"
                      selected={values.lotes || []}
                      options={
                        values.diretorias_regionais &&
                        values.diretorias_regionais.length
                          ? formataOpcoes(
                              listaOpcoes.lotes.filter((lote) =>
                                values.diretorias_regionais.includes(
                                  lote.diretoria_regional.uuid
                                )
                              )
                            )
                          : lotes
                      }
                      onSelectedChanged={(values_) => {
                        form.change("lotes", values_);
                        form.change("unidades_educacionais", []);
                      }}
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os lotes",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Tipo de Unidade</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_unidades"
                      selected={values.tipos_unidades || []}
                      options={tiposUnidades}
                      onSelectedChanged={(values_) =>
                        form.change("tipos_unidades", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os Tipos de Unidades",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-8">
                    <label>Unidade Educacional</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="unidades_educacionais"
                      selected={values.unidades_educacionais || []}
                      options={
                        (values.diretorias_regionais &&
                          values.diretorias_regionais.length) ||
                        (values.lotes && values.lotes.length)
                          ? filtrarOpcoesEscola(values)
                          : unidadesEducacionais
                      }
                      onSelectedChanged={(values_) =>
                        form.change("unidades_educacionais", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todas as Unidades Educacionais",
                        selectAll: "Todas",
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Tipo de Turma</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_turmas"
                      selected={values.tipos_turmas || []}
                      options={tiposTurmas}
                      onSelectedChanged={(values_) =>
                        form.change("tipos_turmas", values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os Tipos de Turmas",
                        selectAll: "Todos",
                      }}
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
