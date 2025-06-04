import moment from "moment";
import React, { useEffect, useReducer, useState, Fragment } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { useNavigationType } from "react-router-dom";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import {
  getNomesDistribuidores,
  getNumerosRequisicoes,
  getRequisicoesDoFiltro,
} from "../../../../services/logistica.service";

import { DisponibilizacaoDeSolicitacoes } from "../DisponibilizacaoDeSolicitacoes";

const initialState = {
  dados: {},
  distribuidores: [],
  requisicoes: [],
};

const FORM_NAME = "buscaRequisicoesDilog";

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDados":
      return { ...state, dados: payload };
    case "atualizarFiltro": {
      if (!payload.searchText.length) {
        return { ...state, [payload.filtro]: [] };
      }
      const reg = new RegExp(payload.searchText, "i");
      const filtrado = state.dados[payload.filtro].filter((el) => reg.test(el));
      return { ...state, [payload.filtro]: filtrado };
    }

    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      // eslint-disable-next-line no-console
      console.error("Invalid action type: ", actionType);
  }
}

const formatDate = (date) => {
  return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
};

const FiltroRequisicaoDilog = ({ initialValues }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filtrado, setFiltrado] = useState(false);
  const [requisicoesFiltro, setRequisicoesFiltro] = useState([]);

  const navigationType = useNavigationType();

  useEffect(() => {
    async function fetchData() {
      Promise.all([getNomesDistribuidores(), getNumerosRequisicoes()]).then(
        ([distribuidores, requisicoes]) => {
          dispatch({
            type: "popularDados",
            payload: {
              distribuidores: distribuidores.data.results.map(
                (el) => el.nome_fantasia
              ),
              requisicoes: requisicoes.data.results.map(
                (el) => el.numero_solicitacao
              ),
            },
          });
        }
      );
    }
    fetchData();
  }, []);

  const onSubmit = async (values) => {
    let queryParams = "";
    for (const [key, value] of Object.entries(values)) {
      if (queryParams.length > 0) {
        queryParams += "&&";
        if (key === "data_inicio" || key === "data_fim") {
          queryParams += `${key}=${formatDate(values[key])}`;
        } else {
          queryParams += `${key}=${value}`;
        }
      } else {
        if (key === "data_inicio" || key === "data_fim") {
          queryParams += `${key}=${formatDate(values[key])}`;
        } else {
          queryParams += `${key}=${value}`;
        }
      }
    }
    const response = await getRequisicoesDoFiltro(queryParams);
    setRequisicoesFiltro(response.data.results);
    setFiltrado(true);
  };

  const onSearch = (filtro, searchText) => {
    dispatch({
      type: "atualizarFiltro",
      payload: {
        filtro,
        searchText,
      },
    });
  };

  return (
    <div className="card">
      <Fragment>
        <div className="card-body">
          <Form
            onSubmit={onSubmit}
            initialValues={navigationType === "POP" && initialValues}
            render={({ form, handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                <FinalFormToRedux form={FORM_NAME} />
                <div className="row">
                  <div className="col-4">
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.requisicoes}
                      label="N° da requisição"
                      name="numero_requisicao"
                      placeholder="Digite o numero da requisição"
                      className="input-busca-produto"
                      onSearch={(v) => onSearch("requisicoes", v)}
                    />
                  </div>
                  <div className="col-3 data_inicio">
                    <Field
                      component={InputComData}
                      name="data_inicio"
                      className="data_inicio"
                      label="Período de Entrega"
                      labelClassName="datepicker-fixed-padding"
                      popperPlacement="bottom-end"
                      placeholder="De"
                      minDate={null}
                      maxDate={
                        values.data_fim
                          ? moment(values.data_fim, "DD/MM/YYYY")._d
                          : null
                      }
                    />
                  </div>
                  <div className="col-3">
                    <label className="col-form-label" />
                    <Field
                      component={InputComData}
                      name="data_fim"
                      labelClassName="datepicker-fixed-padding"
                      popperPlacement="bottom-end"
                      placeholder="Até"
                      minDate={
                        values.data_inicio
                          ? moment(values.data_inicio, "DD/MM/YYYY")._d
                          : null
                      }
                      maxDate={null}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.distribuidores}
                      label="Nome do distribuidor"
                      placeholder="Digite nome do distribuidor/fornecedor"
                      className="input-busca-produto"
                      onSearch={(v) => onSearch("distribuidores", v)}
                      name="nome_distribuidor"
                    />
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <Botao
                    texto="Consultar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    disabled={submitting}
                    onClick={() => {
                      setFiltrado(false);
                    }}
                  />

                  <Botao
                    texto="Limpar Filtros"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => {
                      form.reset({});
                      setRequisicoesFiltro([]);
                      setFiltrado(false);
                    }}
                  />
                </div>
              </form>
            )}
          />
        </div>
        {filtrado && requisicoesFiltro.length > 0 ? (
          <>
            <DisponibilizacaoDeSolicitacoes requisicoes={requisicoesFiltro} />
          </>
        ) : filtrado && requisicoesFiltro.length === 0 ? (
          <div className="text-center pb-4">
            Não existe informação para os critérios de busca utilizados
          </div>
        ) : (
          <Fragment />
        )}
      </Fragment>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    initialValues: state.finalForm[FORM_NAME],
  };
};

export default connect(mapStateToProps)(FiltroRequisicaoDilog);
