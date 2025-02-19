import React, { useEffect, useReducer, useState } from "react";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { useNavigationType } from "react-router-dom";

import AutoCompleteFieldUnaccent from "components/Shareable/AutoCompleteField/unaccent";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { required } from "helpers/fieldValidators";
import { TIPO_PERFIL } from "constants/shared";
import { toastError } from "components/Shareable/Toast/dialogs";

import {
  getAvaliarReclamacaoNomesProdutos,
  getAvaliarReclamacaoNomesMarcas,
  getAvaliarReclamacaoNomesFabricantes,
  getNovaReclamacaoNomesProdutos,
  getNovaReclamacaoNomesMarcas,
  getNovaReclamacaoNomesFabricantes,
  getNomesUnicosEditais,
} from "services/produto.service";

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
  initialValues,
  formName,
  novaReclamacao,
  setEdital,
  setConsultaEfetuada,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  const navigationType = useNavigationType();

  const tipoPerfil = localStorage.getItem("tipo_perfil");
  const ehEscola = tipoPerfil === TIPO_PERFIL.ESCOLA;

  useEffect(() => {
    async function fetchData() {
      try {
        let endpoints;
        if (novaReclamacao) {
          endpoints = [
            getNovaReclamacaoNomesProdutos(),
            getNovaReclamacaoNomesMarcas(),
            getNovaReclamacaoNomesFabricantes(),
            getNomesUnicosEditais(),
          ];
        } else {
          endpoints = [
            getAvaliarReclamacaoNomesProdutos(),
            getAvaliarReclamacaoNomesMarcas(),
            getAvaliarReclamacaoNomesFabricantes(),
          ];
        }

        const [produtos, marcas, fabricantes, editais] = await Promise.all(
          endpoints
        );

        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map((el) => el.nome),
            marcas: marcas.data.results.map((el) => el.nome),
            fabricantes: fabricantes.data.results.map((el) => el.nome),
            editais: editais ? editais.data.results : [],
          },
        });
      } catch (error) {
        toastError(
          "Houve um erro ao buscar os dados de produtos, marcas, fabricantes ou editais"
        );
      } finally {
        ehEscola && setEdital(state.dados.editais);
        setLoading(false);
      }
    }

    fetchData();
  }, [novaReclamacao]);

  const valorInicialEdital =
    !loading && ehEscola && state.dados.editais.length > 0
      ? state.dados.editais[0]
      : undefined;

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        ...(navigationType === "POP" && {
          nome_edital: valorInicialEdital,
          ...initialValues,
        }),
      }}
      render={({ form, handleSubmit, submitting }) => (
        <form
          onSubmit={(event) => {
            setConsultaEfetuada(true);
            handleSubmit(event);
          }}
          className="busca-produtos-formulario"
        >
          <FinalFormToRedux form={formName} />
          <div className="col-6 p-0">
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
              }}
            />
          </div>

          <Field
            component={AutoCompleteFieldUnaccent}
            dataSource={state.dados.produtos}
            label="Nome do Produto"
            className="input-busca-produto"
            name="nome_produto"
          />
          <div className="marca-fabricante-inputs">
            <Field
              component={AutoCompleteFieldUnaccent}
              dataSource={state.dados.marcas}
              label="Marca do Produto"
              name="nome_marca"
            />
            <Field
              component={AutoCompleteFieldUnaccent}
              dataSource={state.dados.fabricantes}
              label="Fabricante do Produto"
              name="nome_fabricante"
            />
          </div>
          <div className="mt-4 mb-4">
            <Botao
              texto="Consultar"
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              disabled={submitting || !form.getState().values.nome_edital}
            />
            <Botao
              texto="Limpar Filtros"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                form.reset({
                  nome_fabricante: undefined,
                  nome_marca: undefined,
                  nome_produto: undefined,
                });
                setEdital(null);
              }}
              className="float-end ms-3"
              disabled={submitting}
            />
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.finalForm[ownProps.formName],
  };
};

export default connect(mapStateToProps)(FormBuscaProduto);
