import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Link } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import { CaretDownOutlined } from "@ant-design/icons";
import { Select as SelectAntd } from "antd";
import { Spin } from "antd";
import { ASelect } from "src/components/Shareable/MakeField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import "./style.scss";
import {
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
  updateListaVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
  getTiposDeAlimentacao,
} from "src/services/cadastroTipoAlimentacao.service";

export default ({ tiposUnidadesEscolar }) => {
  const { Option } = SelectAntd;
  const opcoesTiposUnidades = tiposUnidadesEscolar
    ? tiposUnidadesEscolar.map((tipo) => {
        return <Option key={tipo.uuid}>{tipo.iniciais}</Option>;
      })
    : undefined;

  const [tiposDeAlimentacao, setTiposDeAlimentacao] = useState(undefined);
  const [alterandoTiposDeAlimentacao, setAlterandoTiposDeAlimentacao] =
    useState(false);
  const [vinculos, setVinculos] = useState(undefined);
  const [carregando, setCarregando] = useState(undefined);
  const [open, setOpen] = useState(false);

  async function fetchData() {
    setCarregando(true);
    await getTiposDeAlimentacao().then((response) => {
      setTiposDeAlimentacao(response.results);
    });
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formValues) => {
    setCarregando(true);
    await updateListaVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      formValues
    ).then(async (response) => {
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Tipo de Alimentação salvo com sucesso");
        setVinculos(response.results);
      } else {
        toastError("Erro ao atualizar tipos de alimentação");
      }
    });
    setCarregando(false);
    setAlterandoTiposDeAlimentacao(false);
  };

  const setInitialValues = (vinculos) => {
    let vinculosFormatados = vinculos.map((vinculo) => {
      let tipos_alimentacao = vinculo.tipos_alimentacao.map(
        (tipo_alimentacao) => tipo_alimentacao.uuid
      );
      return {
        tipos_alimentacao: tipos_alimentacao,
        uuid: vinculo.uuid,
        periodo_escolar: vinculo.periodo_escolar.uuid,
        tipo_unidade_escolar: vinculo.tipo_unidade_escolar.uuid,
      };
    });
    return { vinculos: vinculosFormatados };
  };

  const getPeriodosEscolares = async (uuid) => {
    setCarregando(true);
    await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(uuid).then(
      (response) => {
        if (response.results.length === 0) {
          toastError(
            "Nenhum período escolar está associado ao tipo de unidade escolar selecionado"
          );
        } else {
          setVinculos(response.results);
        }
      }
    );
    setCarregando(false);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando || !opcoesTiposUnidades}>
      <div className="card mt-3">
        <div className="card-body formulario-tipo-alimentacao">
          {tiposUnidadesEscolar && (
            <Form
              onSubmit={() => {}}
              initialValues={{}}
              render={({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                  <section className="tipos-de-unidade">
                    <header>Tipos de Unidades</header>
                    <div className="d-flex justify-content-between">
                      <article>
                        <Field
                          component={ASelect}
                          suffixIcon={
                            <CaretDownOutlined onClick={() => setOpen(!open)} />
                          }
                          open={open}
                          onBlur={() => setOpen(false)}
                          onClick={() => setOpen(!open)}
                          showSearch
                          name="tipo_unidade_escolar"
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toString()
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          }
                          disabled={alterandoTiposDeAlimentacao}
                          onChange={(value) => {
                            getPeriodosEscolares(value);
                            form.change("tipo_unidade_escolar", value);
                          }}
                        >
                          {opcoesTiposUnidades}
                        </Field>
                      </article>
                      <Link
                        to={
                          "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais"
                        }
                        style={{ display: "contents" }}
                      >
                        <Botao
                          texto="Permissão de Lançamentos Especiais"
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                        />
                      </Link>
                    </div>
                  </section>
                </form>
              )}
            />
          )}
          {vinculos && (
            <section>
              <Form
                onSubmit={onSubmit}
                initialValues={setInitialValues(vinculos)}
                render={({ submitting, handleSubmit, pristine }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-10 mb-3">
                        <p className="title-tipos-alimentacao">
                          Períodos e Tipos de Refeição
                        </p>
                      </div>
                      <div className="col-2 mb-3">
                        <Botao
                          className="float-end"
                          texto="Salvar"
                          type={BUTTON_TYPE.SUBMIT}
                          style={`${BUTTON_STYLE.GREEN}`}
                          disabled={pristine || submitting}
                        />
                      </div>
                      {vinculos.map((vinculo, indice) => {
                        return (
                          <div className="col-4 w-100" key={indice}>
                            <div className="card mb-1">
                              <div className="custom-card-header">
                                <p className="title-periodo">
                                  {vinculo.periodo_escolar.nome}
                                </p>
                              </div>
                              <div className="card-body">
                                {tiposDeAlimentacao &&
                                  tiposDeAlimentacao.map(
                                    (tipoAlimentacao, idx) => {
                                      return (
                                        <div
                                          className="custom-control custom-checkbox col-12 mb-2"
                                          key={idx}
                                        >
                                          <span
                                            onClick={() =>
                                              setAlterandoTiposDeAlimentacao(
                                                false
                                              )
                                            }
                                          >
                                            <Field
                                              name={`vinculos[${indice}].tipos_alimentacao`}
                                              component="input"
                                              type="checkbox"
                                              value={tipoAlimentacao.uuid}
                                              className="custom-control-input"
                                              id={`${vinculo.periodo_escolar.nome}-${tipoAlimentacao.uuid}`}
                                            />
                                            <label
                                              className="custom-control-label"
                                              htmlFor={`${vinculo.periodo_escolar.nome}-${tipoAlimentacao.uuid}`}
                                            >
                                              {tipoAlimentacao.nome}
                                            </label>
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="offset-10 col-2 mt-3 mb-3">
                        <Botao
                          className="float-end"
                          texto="Salvar"
                          type={BUTTON_TYPE.SUBMIT}
                          style={`${BUTTON_STYLE.GREEN}`}
                          disabled={pristine || submitting}
                        />
                      </div>
                    </div>
                  </form>
                )}
              />
            </section>
          )}
        </div>
      </div>
    </Spin>
  );
};
