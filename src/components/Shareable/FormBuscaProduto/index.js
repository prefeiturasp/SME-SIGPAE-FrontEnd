import React, { useEffect, useReducer } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col } from "antd";
import moment from "moment";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { ASelect } from "components/Shareable/MakeField";
import { Icon, Select as SelectAntd } from "antd";
import { usuarioEhTerceirizada, usuarioEhEscola } from "helpers/utilities";
import { InputComData } from "components/Shareable/DatePicker";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";
import "./style.scss";
import { useHistory } from "react-router-dom";
import {
  getNomesUnicosProdutos,
  getNomesUnicosMarcas,
  getNomesUnicosFabricantes,
  getNomesUnicosEditais,
  getNomesTerceirizadas
} from "services/produto.service";
import { SelectWithHideOptions } from "../SelectWithHideOptions";
import { STATUS_RECLAMACAO_PRODUTO } from "constants/shared";

const tiposProdutos = [
  { nome: "Comum", key: "Comum" },
  { nome: "Dieta Especial", key: "Dieta especial" }
];
const { Option } = SelectAntd;
const listaTipos = tiposProdutos.map(tipo => {
  return <Option key={tipo.key}>{tipo.nome}</Option>;
});

const initialState = {
  dados: {},
  terceirizadas: [],
  produtos: [],
  marcas: [],
  fabricantes: [],
  tipos: listaTipos,
  editais: [],
  status: "",
  inicio: ""
};

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "atualizarInicio":
      return { ...state, inicio: payload };
    case "popularDados":
      return { ...state, dados: payload };
    case "atualizarFiltro": {
      if (!payload.searchText.length) {
        return { ...state, [payload.filtro]: [] };
      }
      const reg = new RegExp(payload.searchText, "i");
      const filtrado = state.dados[payload.filtro].filter(el => reg.test(el));
      return { ...state, [payload.filtro]: filtrado };
    }
    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      throw new Error("Invalid action type: ", actionType);
  }
}

export const FormBuscaProduto = ({
  onSubmit,
  naoExibirRowTerceirizadas,
  statusSelect,
  exibirBotaoVoltar,
  naoExibirLimparFiltros,
  onLimparDados,
  valoresIniciais
}) => {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const endpoints = [
      getNomesUnicosProdutos(),
      getNomesUnicosMarcas(),
      getNomesUnicosFabricantes(),
      getNomesUnicosEditais()
    ];
    if (!naoExibirRowTerceirizadas) endpoints.push(getNomesTerceirizadas());
    async function fetchData() {
      Promise.all(endpoints).then(
        ([produtos, marcas, fabricantes, editais, terceirizadas]) => {
          const nomesTerceirizadas = terceirizadas
            ? terceirizadas.data.results.map(el => el.nome_fantasia)
            : [];
          dispatch({
            type: "popularDados",
            payload: {
              produtos: produtos.data.results,
              marcas: marcas.data.results,
              fabricantes: fabricantes.data.results,
              terceirizadas: nomesTerceirizadas,
              editais: editais.data.results,
              status: STATUS_RECLAMACAO_PRODUTO
            }
          });
        }
      );
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (filtro, searchText) => {
    dispatch({
      type: "atualizarFiltro",
      payload: {
        filtro,
        searchText
      }
    });
  };

  return (
    <Form
      initialValues={valoresIniciais}
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting, values }) => (
        <form
          onSubmit={handleSubmit}
          className="busca-produtos-formulario-shared"
        >
          {!naoExibirRowTerceirizadas && (
            <Row gutter={[16, 16]}>
              <Col md={24} lg={12} xl={16}>
                <Field
                  component={AutoCompleteField}
                  dataSource={state.terceirizadas}
                  label="Nome da terceirizada"
                  onSearch={v => onSearch("terceirizadas", v)}
                  name="nome_terceirizada"
                  disabled={
                    values.agrupado_por_nome_e_marca || usuarioEhTerceirizada()
                  }
                />
              </Col>
              <Col md={24} lg={6} xl={4}>
                <Field
                  component={InputComData}
                  label="Início do Período"
                  name="data_inicial"
                  labelClassName="datepicker-fixed-padding"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : moment()._d
                  }
                  disabled={values.agrupado_por_nome_e_marca}
                />
              </Col>
              <Col md={24} lg={6} xl={4}>
                <Field
                  component={InputComData}
                  label={"Até"}
                  name="data_final"
                  labelClassName="datepicker-fixed-padding"
                  popperPlacement="bottom-end"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={moment()._d}
                  disabled={values.agrupado_por_nome_e_marca}
                />
              </Col>
            </Row>
          )}
          <div className="row">
            <div className="col-4">
              <Field
                component={AutoCompleteField}
                dataSource={state.editais}
                label="Edital"
                className="input-busca-produto"
                onSearch={v => onSearch("editais", v)}
                name="nome_edital"
                disabled={usuarioEhEscola()}
              />
            </div>
            {state.tipos.length > 0 && (
              <div className="col-4">
                <label className="label-aselect">Tipo</label>
                <Field
                  component={ASelect}
                  className="input-busca-tipo-item"
                  placeholder="Selecione um tipo"
                  suffixIcon={<Icon type="caret-down" />}
                  name="tipo"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                >
                  {state.tipos}
                </Field>
              </div>
            )}
            <div className="col-4">
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                className="input-busca-produto"
                onSearch={v => onSearch("produtos", v)}
                name="nome_produto"
              />
            </div>
          </div>
          <Row gutter={[16, 16]}>
            <Col md={24} lg={statusSelect ? 8 : 12}>
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                onSearch={v => onSearch("marcas", v)}
                name="nome_marca"
              />
            </Col>
            <Col md={24} lg={statusSelect ? 8 : 12}>
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                onSearch={v => onSearch("fabricantes", v)}
                name="nome_fabricante"
                disabled={values.agrupado_por_nome_e_marca}
              />
            </Col>
            {statusSelect && (
              <Col md={24} lg={8}>
                <div className="pb-1">
                  <label>Status</label>
                </div>
                <Field
                  component={SelectWithHideOptions}
                  mode="default"
                  options={STATUS_RECLAMACAO_PRODUTO}
                  name="status"
                  handleChange={v => onSearch("status", v)}
                  selectedItems={state.status}
                />
              </Col>
            )}
          </Row>
          <div className="row">
            <div className="col-6">
              <Field
                component={"input"}
                type="checkbox"
                label="Nome da terceirizada"
                name="agrupado_por_nome_e_marca"
              />
              <span className="checkbox-custom" />
              <label
                htmlFor="agrupado_por_nome_e_marca"
                className="checkbox-label"
              >
                Visão agrupada por nome e marca
              </label>
            </div>
            <div className="col-6 text-right">
              {!!exibirBotaoVoltar && (
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  texto={"Voltar"}
                  className="mr-3"
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  onClick={() => history.goBack()}
                />
              )}
              {!naoExibirLimparFiltros && (
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  className="mr-3"
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    form.reset();
                    onLimparDados();
                  }}
                  disabled={submitting}
                />
              )}
              <Botao
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
              />
            </div>
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;
