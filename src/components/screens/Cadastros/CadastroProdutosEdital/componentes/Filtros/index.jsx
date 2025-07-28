import React, { useState } from "react";
import ModalCadastrarProdutosEdital from "src/components/Shareable/ModalCadastrarProdutosEdital";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getCadastroProdutosEdital } from "src/services/produto.service";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import Select from "src/components/Shareable/Select";

export default ({
  setResultado,
  nomes,
  status,
  setCarregando,
  setTotal,
  setFiltros,
  setPage,
  changePage,
  fetchData,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getNomesProdutosFiltrado = (nomeItem) => {
    if (nomeItem) {
      const reg = new RegExp(nomeItem, "iu");
      return nomes.filter((a) => reg.test(a));
    }
    return [];
  };

  const onSubmit = async (formValues) => {
    try {
      setCarregando(true);
      const payload = {
        nome: formValues.nome_item,
        status: formValues.status,
      };
      const response = await getCadastroProdutosEdital(payload);

      if (response.status === HTTP_STATUS.OK) {
        setResultado(response.data.results);
        setTotal(response.data.count);
        setFiltros(payload);
      }
    } catch {
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
                <label htmlFor="nome_item" className="col-form-label">
                  Nome
                </label>
                <Field
                  id="nome_item"
                  dataTestId="nome-item-test"
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
                  dataTestId="filtro-status-select"
                  name="status"
                  component={Select}
                  options={
                    status
                      ? [{ uuid: "", nome: "Selecione uma opção" }].concat(
                          status &&
                            status.map((tipo) => {
                              return { uuid: tipo.status, nome: tipo.status };
                            })
                        )
                      : []
                  }
                />
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
                  className="float-end ms-3"
                  disabled={submitting}
                />
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end ms-3"
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
        onFinish={fetchData}
      />
    </>
  );
};
