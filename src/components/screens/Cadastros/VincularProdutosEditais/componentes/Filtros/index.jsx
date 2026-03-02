import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import ModalVincularProdutosEditais from "../ModalVincularProdutosEditais";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export default ({
  setResultado,
  listaProdutos,
  listaEditais,
  listaEditaisDestino,
  listaTipos,
  setCarregando,
  setTotal,
  setFiltros,
  setPage,
  filtrarPorEditalNomeTipo,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { Option } = SelectAntd;
  const opcoesTipos = listaTipos
    ? listaTipos.map((tipo) => {
        return <Option key={tipo.key}>{tipo.nome}</Option>;
      })
    : [];

  const filtrarPorNome = (value) => {
    if (value) {
      const reg = new RegExp(value, "iu");
      return listaProdutos
        .map((produto) => produto.produto__nome)
        .filter((produto) => reg.test(produto));
    }
    return [];
  };

  const filtrarPorEdital = (value) => {
    if (value) {
      const reg = new RegExp(value, "iu");
      return listaEditais
        .map((edital) => edital.numero)
        .filter((edital) => reg.test(edital));
    }
    return [];
  };

  const onSubmit = async (formValues) => {
    try {
      setCarregando(true);
      let payload = formValues;
      payload["page"] = 1;
      payload["page_size"] = 10;
      const response = await filtrarPorEditalNomeTipo(payload);
      if (response.status === HTTP_STATUS.OK) {
        setResultado(response.data.results);
        setTotal(response.data.count);
        setFiltros(payload);
      }
    } catch {
      toastError("Houve um erro ao tentar filtrar os produtos");
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
              <div className="col-4">
                <label className="col-form-label mb-1">
                  Filtrar por Produto
                </label>
                <Field
                  component={AutoCompleteField}
                  dataSource={filtrarPorNome(values.nome)}
                  name="nome"
                  placeholder="Informe um nome do produto"
                  className="input-busca-nome-item"
                />
              </div>
              <div className="col-4">
                <label className="col-form-label mb-1">
                  Filtrar por Edital
                </label>
                <Field
                  component={AutoCompleteField}
                  dataSource={filtrarPorEdital(values.edital)}
                  name="edital"
                  placeholder="Informe um número de edital"
                  className="input-busca-nome-item"
                />
              </div>
              <div className="col-4">
                <label className="col-form-label">
                  Filtrar por Tipo de Produto
                </label>
                <Field
                  component={ASelect}
                  className="input-busca-tipo-item"
                  placeholder="Selecione um tipo de produto"
                  suffixIcon={
                    <CaretDownOutlined onClick={() => setOpen(!open)} />
                  }
                  open={open}
                  onClick={() => setOpen(!open)}
                  onBlur={() => setOpen(false)}
                  name="tipo"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                >
                  {opcoesTipos}
                </Field>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-8">
                <Botao
                  texto="Selecionar Produtos"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  onClick={() => setShowModal(true)}
                />
              </div>
              <div className="col-4">
                <Botao
                  texto="Filtrar"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                  className="float-end ms-3"
                  disabled={submitting}
                />
                <Botao
                  texto="Limpar"
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
      <ModalVincularProdutosEditais
        closeModal={() => setShowModal(false)}
        showModal={showModal}
        listaEditais={listaEditais}
        listaEditaisDestino={listaEditaisDestino}
        opcoesTipos={opcoesTipos}
      />
    </>
  );
};
