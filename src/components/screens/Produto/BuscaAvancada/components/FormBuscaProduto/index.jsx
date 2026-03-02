import moment from "moment";
import React, { useEffect, useReducer, useState } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { useNavigationType } from "react-router-dom";

import AutoCompleteFieldUnaccent from "src/components/Shareable/AutoCompleteField/unaccent";
import CheckboxField from "src/components/Shareable/Checkbox/Field";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import { SelectWithHideOptions } from "src/components/Shareable/SelectWithHideOptions";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";

import {
  getNomesUnicosProdutos,
  getNomesUnicosMarcas,
  getNomesUnicosFabricantes,
  getNomesTerceirizadas,
  getNomesUnicosEditais,
} from "src/services/produto.service";

import { getOpecoesStatus, retornaStatusBackend } from "./helpers";
import "./style.scss";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { required } from "src/helpers/fieldValidators";

const initialState = {
  dados: {},
  status: ["Ativo", "Suspenso"],
  produtos: [],
  marcas: [],
  fabricantes: [],
  dataMinima: null,
  dataMaxima: null,
  editais: [],
};

const FORM_NAME = "buscaAvancadaProduto";

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDados":
      return { ...state, dados: payload };
    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      // eslint-disable-next-line no-console
      console.error("Invalid action type: ", actionType);
  }
}

const FormBuscaProduto = ({ setFiltros, setPage, initialValues }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState({
    opcoesStatus: getOpecoesStatus(),
    statusSelecionados: [],
  });

  const navigationType = useNavigationType();

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesUnicosProdutos(),
        getNomesUnicosMarcas(),
        getNomesUnicosFabricantes(),
        getNomesTerceirizadas(),
        getNomesUnicosEditais(),
      ]).then(([produtos, marcas, fabricantes, terceirizadas, editais]) =>
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results,
            marcas: marcas.data.results,
            fabricantes: fabricantes.data.results,
            terceirizadas: terceirizadas.data.results.map(
              (el) => el.nome_fantasia,
            ),
            editais: editais.data.results?.filter(
              (item) => item !== "PARCEIRA",
            ),
          },
        }),
      );
    }
    fetchData();
  }, []);

  const onSelectStatus = (value) => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: [], statusSelecionados: ["Todos"] });
    } else {
      setStatus({
        opcoesStatus: getOpecoesStatus(),
        statusSelecionados: [...status.statusSelecionados, value],
      });
    }
  };

  const onDeselectStatus = (value) => {
    if (value === "Todos") {
      setStatus({ opcoesStatus: getOpecoesStatus(), statusSelecionados: [] });
    } else {
      const filtered = status.statusSelecionados.filter(
        (item) => item !== value,
      );
      setStatus({
        opcoesStatus: getOpecoesStatus(),
        statusSelecionados: filtered,
      });
    }
  };

  const onSubmit = (values) => {
    let formValues = JSON.parse(JSON.stringify(values));

    if (formValues.tipo_produto_comum && !formValues.dieta_especial) {
      formValues.eh_para_alunos_com_dieta = false;
    } else if (!formValues.tipo_produto_comum && formValues.dieta_especial) {
      formValues.eh_para_alunos_com_dieta = true;
    }

    if (formValues.status) {
      if (formValues.status.includes("Todos")) {
        delete formValues.status;
      } else {
        if (formValues.status[0] === "") formValues.status.splice(0, 1);
        formValues.status.forEach((status, index) => {
          const statusBackend = retornaStatusBackend(status);
          formValues.status[index] = statusBackend;
        });
      }
    }

    setFiltros({ ...formValues });
    setPage(1);
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={navigationType === "POP" && initialValues}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} className="busca-produtos">
          <FinalFormToRedux form={FORM_NAME} />
          <div className="row">
            <div className="col-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.dados.editais}
                data-testid="edital"
                label="Edital"
                className="input-busca-produto"
                name="nome_edital"
                required
                validate={required}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-12 col-md-4 col-xl-4">
              <div className="row">
                <label className="ms-1">Data cadastro</label>
              </div>
              <div className="row">
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_inicial"
                    className="data-inicial"
                    labelClassName="datepicker-fixed-padding"
                    placeholder="De"
                    minDate={null}
                    maxDate={
                      values.data_final
                        ? moment(values.data_final, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                  />
                </div>
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_final"
                    labelClassName="datepicker-fixed-padding"
                    popperPlacement="bottom-end"
                    placeholder="Até"
                    minDate={
                      values.data_inicial
                        ? moment(values.data_inicial, "DD/MM/YYYY")._d
                        : null
                    }
                    maxDate={moment()._d}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-xl-5">
              <label>Status</label>
              <Field
                component={SelectWithHideOptions}
                options={status.opcoesStatus}
                name="status"
                selectedItems={status.statusSelecionados}
                onSelect={(value) => onSelectStatus(value)}
                onDeselect={(value) => onDeselectStatus(value)}
              />
            </div>
            <div className="col-12 col-md-3 col-xl-3 check-tipos-prod">
              <div className="row">
                <label className="ms-1">Tipo de produto</label>
              </div>

              <div className="row">
                <div className="col mt-2 ms-1">
                  <Field
                    className="check-tipo-produto"
                    component={CheckboxField}
                    name="tipo_produto_comum"
                    type="checkbox"
                    nomeInput="Comum"
                  />
                </div>
                <div className="col mt-2">
                  <Field
                    className="check-tipo-produto"
                    component={CheckboxField}
                    name="dieta_especial"
                    type="checkbox"
                    nomeInput="Dieta especial"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row mt-2">
            <div className="col-md-3 col-xl-3">
              <label>Ingredientes/aditivos alergênicos?</label>
              <div className="check-produto_alergenico">
                <Field
                  component={CheckboxField}
                  name="tem_aditivos_alergenicos"
                  nomeInput={"Sim"}
                  type="checkbox"
                />
              </div>
            </div>
            <div className="col-md-9 col-xl-9">
              <label>
                Quais? (Possível Informar um ou mais ingredientes separados por
                vírgula)
              </label>
              <Field
                component={InputText}
                name="aditivos"
                disabled={!values.tem_aditivos_alergenicos}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-12 col-xl-12">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={state.dados.produtos}
                label="Nome do Produto"
                placeholder="Digite nome do produto"
                className="input-busca-produto"
                name="nome_produto"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={state.dados.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                placeholder="Digite marca do produto"
                name="nome_marca"
              />
            </div>
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={state.dados.fabricantes}
                label="Fabricante do Produto"
                placeholder="Digite fabricante do produto"
                name="nome_fabricante"
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
            />

            <Botao
              texto="Limpar Filtros"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end ms-3"
              onClick={() => {
                form.reset({
                  tipo_produto_comum: undefined,
                  dieta_especial: undefined,
                  nome_fabricante: undefined,
                  nome_marca: undefined,
                  nome_produto: undefined,
                  aditivos: undefined,
                  tem_aditivos_alergenicos: undefined,
                  status: undefined,
                  data_final: undefined,
                  data_inicial: undefined,
                });
                setStatus({
                  opcoesStatus: getOpecoesStatus(),
                  statusSelecionados: [],
                });
              }}
            />
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    initialValues: state.finalForm[FORM_NAME],
  };
};

export default connect(mapStateToProps)(FormBuscaProduto);
