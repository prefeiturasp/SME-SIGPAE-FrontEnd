import React, { useEffect, useReducer, useState } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { Spin } from "antd";

import AutoCompleteFieldUnaccent from "src/components/Shareable/AutoCompleteField/unaccent";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { required } from "src/helpers/fieldValidators";
import { TIPO_PERFIL } from "src/constants/shared";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import {
  getAvaliarReclamacaoNomesProdutos,
  getAvaliarReclamacaoNomesMarcas,
  getAvaliarReclamacaoNomesFabricantes,
  getNovaReclamacaoNomesProdutos,
  getNovaReclamacaoNomesMarcas,
  getNovaReclamacaoNomesFabricantes,
  getNomesUnicosEditais,
} from "src/services/produto.service";

const initialState = {
  dados: {},
  produtos: [],
  marcas: [],
  fabricantes: [],
  editais: [],
};

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDados":
      return { ...state, dados: payload };
    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      throw new Error("Invalid action type: ", actionType);
  }
}

const FormBuscaProduto = ({
  onSubmit,
  formName,
  novaReclamacao,
  setEdital,
  edital,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const ehEscola = tipoPerfil === TIPO_PERFIL.ESCOLA;

  useEffect(() => {
    async function fetchEditais() {
      try {
        if (novaReclamacao) {
          const response = await getNomesUnicosEditais();
          dispatch({
            type: "popularDados",
            payload: {
              ...state.dados,
              editais: response.data.results,
            },
          });
          ehEscola && setEdital(response.data.results[0]);
        }
      } catch (error) {
        toastError("Houve um erro ao buscar os dados de editais");
      } finally {
        setLoading(false);
      }
    }

    fetchEditais();
  }, []);

  const handleEditalChange = async (nomeEdital) => {
    try {
      setLoading(true);

      let endpoints;
      if (novaReclamacao) {
        endpoints = [
          getNovaReclamacaoNomesProdutos({ nome_edital: nomeEdital }),
          getNovaReclamacaoNomesMarcas({ nome_edital: nomeEdital }),
          getNovaReclamacaoNomesFabricantes({ nome_edital: nomeEdital }),
        ];
      } else {
        endpoints = [
          getAvaliarReclamacaoNomesProdutos(),
          getAvaliarReclamacaoNomesMarcas(),
          getAvaliarReclamacaoNomesFabricantes(),
        ];
      }

      const [produtos, marcas, fabricantes] = await Promise.all(endpoints);

      dispatch({
        type: "popularDados",
        payload: {
          ...state.dados,
          produtos: produtos.data.results.map((el) => el.nome),
          marcas: marcas.data.results.map((el) => el.nome),
          fabricantes: fabricantes.data.results.map((el) => el.nome),
        },
      });
    } catch (error) {
      toastError(
        "Houve um erro ao buscar os dados de produtos, marcas ou fabricantes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (edital || !novaReclamacao) {
      handleEditalChange(edital);
    }
  }, [edital]);

  return (
    <Spin tip="Carregando..." spinning={loading}>
      {!loading && (
        <Form
          onSubmit={onSubmit}
          initialValues={{
            nome_edital: edital,
          }}
          render={({ form, handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className="busca-produtos-formulario">
              <FinalFormToRedux form={formName} />
              {novaReclamacao && (
                <div className="col-12 p-0">
                  <Field
                    component={AutoCompleteField}
                    dataSource={state.dados.editais}
                    data-testid="edital"
                    label="Edital"
                    className="input-busca-produto"
                    name="nome_edital"
                    required
                    validate={required}
                    disabled={ehEscola}
                    inputOnChange={(value) => {
                      setEdital(value);
                      handleEditalChange(value);
                    }}
                  />
                </div>
              )}
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={state.dados.produtos}
                data-testid="produto"
                label="Nome do Produto"
                className="input-busca-produto"
                name="nome_produto"
                disabled={novaReclamacao && !form.getState().values.nome_edital}
              />
              <div className="marca-fabricante-inputs">
                <Field
                  component={AutoCompleteFieldUnaccent}
                  dataSource={state.dados.marcas}
                  label="Marca do Produto"
                  name="nome_marca"
                  disabled={
                    novaReclamacao && !form.getState().values.nome_edital
                  }
                />
                <Field
                  component={AutoCompleteFieldUnaccent}
                  dataSource={state.dados.fabricantes}
                  label="Fabricante do Produto"
                  name="nome_fabricante"
                  disabled={
                    novaReclamacao && !form.getState().values.nome_edital
                  }
                />
              </div>
              <div className="mt-4 mb-4">
                <Botao
                  texto="Consultar"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="float-end ms-3"
                  disabled={
                    submitting ||
                    (form.getState().values.nome_edital !== undefined &&
                      !form.getState().values.nome_edital)
                  }
                />
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    form.change("nome_produto", undefined);
                    form.change("nome_marca", undefined);
                    form.change("nome_fabricante", undefined);

                    if (!ehEscola && novaReclamacao) {
                      form.change("nome_edital", undefined);
                      setEdital(null);
                    }
                  }}
                  className="float-end ms-3"
                  disabled={submitting}
                />
              </div>
            </form>
          )}
        />
      )}
    </Spin>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.finalForm[ownProps.formName],
  };
};

export default connect(mapStateToProps)(FormBuscaProduto);
