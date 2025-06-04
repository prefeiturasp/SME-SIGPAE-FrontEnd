import React, { useState, useEffect, useReducer } from "react";
import HTTP_STATUS from "http-status-codes";
import { Form, Field } from "react-final-form";
import moment from "moment";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { ASelect } from "src/components/Shareable/MakeField";
import { CaretDownOutlined } from "@ant-design/icons";
import { Select as SelectAntd } from "antd";
import {
  usuarioEhEmpresaTerceirizada,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhGticCODAE,
  ehUsuarioRelatorios,
} from "src/helpers/utilities";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import {
  getNomesUnicosProdutos,
  getNomesUnicosMarcas,
  getNomesUnicosFabricantes,
  getNomesUnicosEditais,
  getNomesTerceirizadas,
  getEditaisDre,
} from "src/services/produto.service";
import { SelectWithHideOptions } from "../SelectWithHideOptions";
import { STATUS_RECLAMACAO_PRODUTO } from "src/constants/shared";
import { required } from "src/helpers/fieldValidators";

const tiposProdutos = [
  { nome: "Comum", key: "Comum" },
  { nome: "Dieta Especial", key: "Dieta especial" },
];
const { Option } = SelectAntd;
const listaTipos = tiposProdutos.map((tipo) => {
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
  inicio: "",
};

const exibirFiltroNomeTerceirizada =
  !usuarioEhEscolaTerceirizadaDiretor() &&
  !usuarioEhEscolaTerceirizada() &&
  !usuarioEhEmpresaTerceirizada() &&
  !usuarioEhCODAEGestaoAlimentacao() &&
  !usuarioEhNutricionistaSupervisao() &&
  !usuarioEhCODAENutriManifestacao() &&
  !usuarioEhCODAEGabinete() &&
  !ehUsuarioRelatorios() &&
  !usuarioEhGticCODAE();

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
      const filtrado = state.dados[payload.filtro].filter((el) => reg.test(el));
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
  valoresIniciais,
  setErroAPI,
}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editaisDRE, setEditaisDRE] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListaEditaisDREAsync = async () => {
      const response = await getEditaisDre();
      if (response.status === HTTP_STATUS.OK) {
        setEditaisDRE(
          response.data.results.map((element) => {
            return { value: element.numero, label: element.numero };
          })
        );
      } else {
        setErroAPI &&
          setErroAPI(
            "Erro ao carregar editais da DRE. Tente novamente mais tarde"
          );
      }
    };
    const endpoints = [
      getNomesUnicosProdutos(),
      getNomesUnicosMarcas(),
      getNomesUnicosFabricantes(),
      getNomesUnicosEditais(),
    ];
    if (!naoExibirRowTerceirizadas) endpoints.push(getNomesTerceirizadas());
    async function fetchData() {
      Promise.all(endpoints).then(
        ([produtos, marcas, fabricantes, editais, terceirizadas]) => {
          const nomesTerceirizadas = terceirizadas
            ? terceirizadas.data.results.map((el) => el.nome_fantasia)
            : [];
          dispatch({
            type: "popularDados",
            payload: {
              produtos: produtos.data.results,
              marcas: marcas.data.results,
              fabricantes: fabricantes.data.results,
              terceirizadas: nomesTerceirizadas,
              editais: editais.data.results,
              status: STATUS_RECLAMACAO_PRODUTO,
            },
          });
          setLoading(false);
        }
      );
    }
    fetchData();
    usuarioEhDRE() && getListaEditaisDREAsync();
  }, []);

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
    <Form
      initialValues={valoresIniciais}
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting, values }) => (
        <form
          onSubmit={handleSubmit}
          className="busca-produtos-formulario-shared"
        >
          {!naoExibirRowTerceirizadas && (
            <>
              <div className="row">
                <div className="col-8">
                  {exibirFiltroNomeTerceirizada && (
                    <Field
                      component={AutoCompleteField}
                      dataSource={state.terceirizadas}
                      label="Nome da terceirizada"
                      onSearch={(v) => onSearch("terceirizadas", v)}
                      name="nome_terceirizada"
                      disabled={
                        values.agrupado_por_nome_e_marca ||
                        usuarioEhEmpresaTerceirizada() ||
                        loading
                      }
                    />
                  )}
                  {(usuarioEhEscolaTerceirizadaDiretor() ||
                    usuarioEhEscolaTerceirizada() ||
                    usuarioEhEmpresaTerceirizada()) && (
                    <div className="row">
                      <div className="col-6">
                        <Field
                          component={AutoCompleteField}
                          dataSource={state.editais}
                          label="Edital"
                          className="input-busca-produto"
                          onSearch={(v) => onSearch("editais", v)}
                          name="nome_edital"
                          required
                          validate={required}
                          disabled={
                            usuarioEhEscolaTerceirizadaDiretor() ||
                            usuarioEhEscolaTerceirizada() ||
                            loading
                          }
                        />
                      </div>
                      {state.tipos.length > 0 && (
                        <div className="col-6">
                          <label className="label-aselect">Tipo</label>
                          <Field
                            component={ASelect}
                            className="input-busca-tipo-item"
                            placeholder="Selecione um tipo"
                            suffixIcon={<CaretDownOutlined />}
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
                    </div>
                  )}
                </div>
                <div className="col-4 data-prod-hom">
                  <Field
                    component={InputComData}
                    label="Homologados até:"
                    name="data_homologacao"
                    labelClassName="datepicker-fixed-padding"
                    minDate={null}
                    maxDate={
                      values.data_final
                        ? moment(values.data_final, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                    writable={true}
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    disabled={values.agrupado_por_nome_e_marca}
                  />
                </div>
              </div>
            </>
          )}
          <div className="row">
            {!usuarioEhEscolaTerceirizadaDiretor() &&
              !usuarioEhEscolaTerceirizada() &&
              !usuarioEhEmpresaTerceirizada() && (
                <>
                  <div
                    className={`col-${
                      !usuarioEhEscolaTerceirizadaDiretor() &&
                      !usuarioEhEscolaTerceirizada() &&
                      !usuarioEhEmpresaTerceirizada()
                        ? "6"
                        : "4"
                    }`}
                  >
                    {usuarioEhDRE() ? (
                      <>
                        <span className="required-asterisk">*</span>
                        <label className="mb-1 mt-2">Edital</label>
                        <Field
                          component={ASelect}
                          className="input-busca-tipo-item"
                          name="nome_edital"
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toString()
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          }
                          required
                          validate={required}
                          options={editaisDRE}
                        />
                      </>
                    ) : (
                      <>
                        <span className="required-asterisk">*</span>
                        <label className="mb-1 mt-2">Edital</label>
                        <Field
                          component={AutoCompleteField}
                          dataSource={state.editais}
                          className="input-busca-produto mt-1"
                          onSearch={(v) => onSearch("editais", v)}
                          name="nome_edital"
                          required
                          validate={required}
                          disabled={
                            usuarioEhEscolaTerceirizadaDiretor() ||
                            usuarioEhEscolaTerceirizada()
                          }
                        />
                      </>
                    )}
                  </div>

                  {state.tipos.length > 0 && (
                    <div
                      className={`col-${
                        !usuarioEhEscolaTerceirizadaDiretor() &&
                        !usuarioEhEscolaTerceirizada() &&
                        !usuarioEhEmpresaTerceirizada()
                          ? "6"
                          : "4"
                      }`}
                    >
                      <label className="label-aselect mt-2">Tipo</label>
                      <Field
                        component={ASelect}
                        className="input-busca-tipo-item"
                        placeholder="Selecione um tipo"
                        suffixIcon={<CaretDownOutlined />}
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
                </>
              )}
          </div>
          <div className="row">
            <div className={`col-4`}>
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                onSearch={(v) => onSearch("marcas", v)}
                name="nome_marca"
              />
            </div>
            <div className={`col-4`}>
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                onSearch={(v) => onSearch("fabricantes", v)}
                name="nome_fabricante"
                disabled={values.agrupado_por_nome_e_marca}
              />
            </div>
            {statusSelect && (
              <div className={`col-4`}>
                <div className="pb-1">
                  <label>Status</label>
                </div>
                <Field
                  component={SelectWithHideOptions}
                  mode="default"
                  options={STATUS_RECLAMACAO_PRODUTO}
                  name="status"
                  handleChange={(v) => onSearch("status", v)}
                  selectedItems={state.status}
                />
              </div>
            )}
            <div className="col-4">
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                className="input-busca-produto"
                onSearch={(v) => onSearch("produtos", v)}
                name="nome_produto"
              />
            </div>
          </div>
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
            <div className="col-6 text-end mt-3">
              {!!exibirBotaoVoltar && (
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  texto={"Voltar"}
                  className="me-3"
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  onClick={() => navigate(-1)}
                />
              )}
              {!naoExibirLimparFiltros && (
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  className="me-3"
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
