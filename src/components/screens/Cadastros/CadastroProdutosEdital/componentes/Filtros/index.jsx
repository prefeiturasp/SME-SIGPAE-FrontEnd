import React, { useState } from "react";
import ModalCadastrarProdutosEdital from "components/Shareable/ModalCadastrarProdutosEdital";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { ASelect } from "components/Shareable/MakeField";
import { CaretDownOutlined } from "@ant-design/icons";
import { Select as SelectAntd } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { getCadastroProdutosEdital } from "services/produto.service";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "components/Shareable/Toast/dialogs";

export default ({
  setResultado,
  nomes,
  status,
  setCarregando,
  setTotal,
  setFiltros,
  setPage,
  changePage
}) => {
  const [showModal, setShowModal] = useState(false);
  const { Option } = SelectAntd;
  const opcoes = status
    ? status.map(tipo => {
        return <Option key={tipo.status}>{tipo.status}</Option>;
      })
    : [];

  const getNomesProdutosFiltrado = nomeItem => {
    if (nomeItem) {
      const reg = new RegExp(nomeItem, "iu");
      return nomes.filter(a => reg.test(a));
    }
    return [];
  };

  const onSubmit = async formValues => {
    try {
      setCarregando(true);
      const payload = {
        nome: formValues.nome_item,
        status: formValues.status
      };
      const response = await getCadastroProdutosEdital(payload);
      if (response.status === HTTP_STATUS.OK) {
        setResultado(response.data.results);
        setTotal(response.data.count);
        setFiltros(payload);
      }
    } catch (e) {
      toastError("Houve um erro ao tentar filtrar os Itens");
    }
    setCarregando(false);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ submitting, form, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mt-3 mb-3">
              <div className="col-8">
                <label className="col-form-label mb-1">Nome</label>
                <Field
                  component={AutoCompleteField}
                  dataSource={getNomesProdutosFiltrado(values.nome_item)}
                  name="nome_item"
                  placeholder="Digite um nome"
                  className="input-busca-nome-item"
                />
              </div>
              <div className="col-4">
                <label className="col-form-label">Status</label>
                <Field
                  component={ASelect}
                  className="input-busca-tipo-item"
                  suffixIcon={<CaretDownOutlined />}
                  showSearch
                  name="status"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                >
                  {opcoes}
                </Field>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-8">
                <Botao
                  texto="Cadastrar Produto"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  onClick={() => setShowModal(true)}
                />
              </div>
              <div className="col-4">
                <Botao
                  texto="Pesquisar"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="float-right ml-3"
                  disabled={submitting}
                />
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-right ml-3"
                  onClick={() => {
                    form.reset({});
                    setResultado(undefined);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </form>
        )}
      />
      <ModalCadastrarProdutosEdital
        closeModal={() => setShowModal(false)}
        showModal={showModal}
        changePage={() => changePage()}
      />
    </>
  );
};
