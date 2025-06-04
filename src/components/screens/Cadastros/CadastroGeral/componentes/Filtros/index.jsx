import React, { useState } from "react";
import ModalCadastrarItem from "src/components/Shareable/ModalCadastrarItem";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { consultaItems } from "src/services/produto.service";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export default ({
  setResultado,
  nomes,
  tipos,
  setCarregando,
  setTotal,
  setFiltros,
  setPage,
  changePage,
  tipoFixo,
  initialValues,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { Option } = SelectAntd;
  const opcoes = tipos
    ? tipos.map((tipo) => {
        return <Option key={tipo.tipo}>{tipo.tipo_display}</Option>;
      })
    : [];

  const getNomesItemsFiltrado = (nomeItem) => {
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
        tipo: formValues.tipo,
      };
      const response = await consultaItems(payload);
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
        initialValues={initialValues}
        render={({ submitting, form, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mt-3 mb-3">
              <div className="col-8">
                <label className="col-form-label mb-1">Nome</label>
                <Field
                  component={AutoCompleteField}
                  dataSource={getNomesItemsFiltrado(values.nome_item)}
                  name="nome_item"
                  placeholder="Digite um nome"
                  className="input-busca-nome-item"
                />
              </div>
              <div className="col-4">
                <label className="col-form-label">Tipo</label>
                <Field
                  component={ASelect}
                  className="input-busca-tipo-item"
                  suffixIcon={
                    <CaretDownOutlined onClick={() => setOpen(!open)} />
                  }
                  open={open}
                  onClick={() => setOpen(!open)}
                  onBlur={() => setOpen(false)}
                  showSearch
                  name="tipo"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toString()
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  disabled={tipoFixo}
                >
                  {opcoes}
                </Field>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-8">
                <Botao
                  texto="Cadastrar Item"
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
                    form.reset(initialValues);
                    setResultado(undefined);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </form>
        )}
      />
      <ModalCadastrarItem
        closeModal={() => setShowModal(false)}
        showModal={showModal}
        changePage={() => changePage()}
        tipoFixo={tipoFixo}
      />
    </>
  );
};
