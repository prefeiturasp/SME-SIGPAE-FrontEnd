import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Form, Field, FormSpy } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { formatarParaMultiselect } from "src/helpers/utilities";
import { ASelect } from "src/components/Shareable/MakeField";
import { Select as SelectAntd } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { TreeSelect, Spin } from "antd";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  getListaProdutos,
  criarVinculoProdutosEditais,
} from "src/services/produto.service";
import HTTP_STATUS from "http-status-codes";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { formatarOpcoes, validatePayload } from "./helper";
import { EDITAIS_INVALIDOS } from "src/helpers/gestaoDeProdutos";

import "./style.scss";

export default ({ closeModal, showModal, listaEditais, opcoesTipos }) => {
  const [carregando, setCarregando] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(true);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [editalOrigem, setEditalOrigem] = useState(null);
  const [tipoProdEditalOrigem, setTipoProdEditalOrigem] = useState(null);
  const [opcoesEditaisOrigem, setOpcoesEditaisOrigem] = useState([]);
  const [opcoesEditaisDestino, setOpcoesEditaisDestino] = useState([]);
  const [opcoesProdutosEditais, setOpcoesProdutosEditais] = useState([]);
  const [openSelect1, setOpenSelect1] = useState(false);
  const [openSelect2, setOpenSelect2] = useState(false);
  const [openSelect3, setOpenSelect3] = useState(false);
  const [produtosEditaisSelecionados, setProdutosEditaisSelecionados] =
    useState([]);
  const [qtdProdutosGetListaProdutos, setQtdProdutosGetListaProdutos] =
    useState(0);
  const [erros, setErros] = useState({
    editalOrigem: false,
    editaisDestino: false,
    tipoProduto: false,
    produtos: false,
  });

  const { SHOW_PARENT } = TreeSelect;
  const { Option } = SelectAntd;

  const onSubmit = async (formValues) => {
    let payload = formValues;
    if (produtosEditaisSelecionados.length !== 0) {
      const produtos_editais = produtosEditaisSelecionados.filter(
        (prod) => prod !== "todos",
      );
      payload["produtos_editais"] = produtos_editais;
    }
    let resultadoValidacao = await validatePayload(payload);
    setErros(resultadoValidacao);
    let temErros = Object.keys(resultadoValidacao).find(
      (k) => resultadoValidacao[k] === true,
    );
    if (temErros === undefined) {
      try {
        const response = await criarVinculoProdutosEditais(payload);
        if (response.status === HTTP_STATUS.CREATED) {
          toastSuccess("Produtos vinculados com sucesso!");
        }
      } catch (e) {
        toastError(`Houve um erro ao tentar vincular produtos: ${e}`);
      }
      setProdutosEditaisSelecionados([]);
      setOpcoesProdutosEditais([]);
      closeModal();
    } else {
      toastError("Verifique os campos obrigatórios");
    }
  };

  const onChangeProdutosEditais = (_value, _label, extra) => {
    setErros({ ...erros, produtos: _value.length === 0 });
    if (extra.triggerValue === "todos") {
      let checked = [];
      if (produtosEditaisSelecionados.length > 0) {
        setProdutosEditaisSelecionados([]);
      } else {
        opcoesProdutosEditais
          .filter((op) => op.key !== "todos")
          .map((op) => op.children.map((ch) => checked.push(ch.key)));
        checked.push("todos");
        setProdutosEditaisSelecionados(checked);
      }
      return;
    }
    let resultado = produtosEditaisSelecionados;
    if (extra.triggerNode && extra.triggerNode.props.todos) {
      let uuids;
      if (extra.triggerNode.props.children.length) {
        uuids = extra.triggerNode.props.children.map((pe) => pe.key);
      } else {
        uuids = opcoesProdutosEditais
          .find((op) => op.title === extra.triggerValue)
          .children.map((child) => child.value);
      }
      if (extra.checked) {
        resultado = resultado.concat(uuids);
      } else {
        resultado = resultado.filter((uuid) => !uuids.includes(uuid));
      }
    } else {
      if (extra.checked) {
        resultado = resultado.concat([extra.triggerValue]);
      } else {
        resultado = resultado.filter(
          (uuid) => !extra.triggerValue.includes(uuid),
        );
      }
    }
    if (extra.preValue.find((v) => v.value === "todos")) {
      resultado = resultado.filter((prod) => prod !== "todos");
    }
    resultado = [...new Set(resultado)];
    if (qtdProdutosGetListaProdutos === resultado.length) {
      resultado.push("todos");
    }
    setProdutosEditaisSelecionados(resultado);
  };

  useEffect(() => {
    setCarregando(true);
    if (listaEditais) {
      const opcoes = listaEditais.map((edital) => {
        return <Option key={edital.uuid}>{edital.numero}</Option>;
      });
      setOpcoesEditaisOrigem(opcoes);
      setCarregando(false);
    }
  }, [listaEditais]);

  const onChangeEditalDeOrigem = (value, form) => {
    form.change("edital_origem", value);
    setErros({
      ...erros,
      editalOrigem: value && value.length > 0 ? false : true,
    });

    return;
  };

  const onChangeFormSpy = async (changes) => {
    if (
      changes.values["edital_origem"] &&
      changes.values["tipo_produto_edital_origem"] &&
      (changes.values["tipo_produto_edital_origem"] !== tipoProdEditalOrigem ||
        changes.values["edital_origem"] !== editalOrigem) &&
      ["edital_origem", "tipo_produto_edital_origem"].includes(
        changes.active,
      ) &&
      !loadingProdutos
    ) {
      setOpcoesProdutosEditais([]);
      setProdutosEditaisSelecionados([]);
      setDesabilitarCampos(false);
      setLoadingProdutos(true);
      setCarregando(true);
      setEditalOrigem(changes.values["edital_origem"]);
      setTipoProdEditalOrigem(changes.values["tipo_produto_edital_origem"]);
      let opcoesDestino = listaEditais
        .filter(
          (edital) =>
            !changes.values["edital_origem"].includes(edital.uuid) &&
            !EDITAIS_INVALIDOS.includes(edital.numero.toUpperCase()),
        )
        .map((edital) => {
          return { nome: edital.numero, uuid: edital.uuid };
        });
      setOpcoesEditaisDestino(opcoesDestino);
      try {
        const response = await getListaProdutos({
          editais: changes.values["edital_origem"],
          tipo_produto_edital_origem:
            changes.values["tipo_produto_edital_origem"],
        });
        if (response.status === HTTP_STATUS.OK) {
          let t = [];
          if (response.data.length > 0) {
            t.push({
              title: (
                <span
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  Todos
                </span>
              ),
              value: "todos",
              key: "todos",
            });
          }
          t.push(...formatarOpcoes(response.data));
          setOpcoesProdutosEditais(t);
          setLoadingProdutos(false);
          setCarregando(false);
          setQtdProdutosGetListaProdutos(response.data.length);
        }
      } catch {
        toastError("Houve um erro ao carregar opções dos produtos");
        setLoadingProdutos(false);
        setCarregando(false);
      }
    }
  };

  return (
    <Modal
      backdrop={"static"}
      dialogClassName="modal-produtos-editais"
      show={showModal}
      onHide={() => {
        setProdutosEditaisSelecionados([]);
        setOpcoesProdutosEditais([]);
        closeModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Selecionar produtos provenientes de editais</Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={carregando}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, values, form }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <FormSpy
                  subscription={{ values: true, active: true }}
                  onChange={(changes) => onChangeFormSpy(changes)}
                />
                <div className="row">
                  <div className="col-4">
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label pb-3">
                      Edital de origem
                    </label>
                    <Field
                      component={ASelect}
                      placeholder={"Selecione um edital"}
                      suffixIcon={
                        <CaretDownOutlined
                          onClick={() => setOpenSelect1(!openSelect1)}
                        />
                      }
                      open={openSelect1}
                      onClick={() => setOpenSelect1(!openSelect1)}
                      onBlur={() => setOpenSelect1(false)}
                      name="edital_origem"
                      onChange={(value) => onChangeEditalDeOrigem(value, form)}
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                    >
                      {opcoesEditaisOrigem}
                    </Field>
                    {erros.editalOrigem && (
                      <div className="ant-form-explain customError">
                        Campo obrigatório
                      </div>
                    )}
                  </div>
                  <div className="col-4">
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label pb-3">
                      Tipo de Produto Edital de Origem
                    </label>
                    <Field
                      component={ASelect}
                      placeholder={"Selecione o tipo de produto"}
                      suffixIcon={
                        <CaretDownOutlined
                          onClick={() => setOpenSelect2(!openSelect2)}
                        />
                      }
                      open={openSelect2}
                      onClick={() => setOpenSelect2(!openSelect2)}
                      onBlur={() => setOpenSelect2(false)}
                      name="tipo_produto_edital_origem"
                      onChange={(value) => {
                        form.change("tipo_produto_edital_origem", value);
                        setErros({
                          ...erros,
                          tipoProdutoEditalOrigem:
                            value && value.length > 0 ? false : true,
                        });
                      }}
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                    >
                      {opcoesTipos}
                    </Field>
                    {erros.tipoProdutoEditalOrigem && (
                      <div className="ant-form-explain customError">
                        Campo obrigatório
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label pb-3">Produtos</label>
                    <TreeSelect
                      treeData={opcoesProdutosEditais}
                      value={produtosEditaisSelecionados}
                      onChange={onChangeProdutosEditais}
                      treeCheckable={true}
                      showCheckedStrategy={SHOW_PARENT}
                      placeholder="Selecione os produtos"
                      treeNodeFilterProp="title"
                      style={{ width: "100%" }}
                      disabled={desabilitarCampos}
                    />
                    {erros.produtos && (
                      <div className="ant-form-explain">Campo obrigatório</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label pb-3">
                      Tipo de Produto Novo Edital
                    </label>
                    <Field
                      component={ASelect}
                      className="input-busca-tipo-item"
                      suffixIcon={
                        <CaretDownOutlined
                          onClick={() => setOpenSelect3(!openSelect3)}
                        />
                      }
                      open={openSelect3}
                      onClick={() => setOpenSelect3(!openSelect3)}
                      onBlur={() => setOpenSelect3(false)}
                      name="tipo_produto"
                      onChange={(value) => {
                        form.change("tipo_produto", value);
                        setErros({
                          ...erros,
                          tipoProduto: value && value.length > 0 ? false : true,
                        });
                      }}
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      }
                      disabled={desabilitarCampos}
                    >
                      {opcoesTipos}
                    </Field>
                    {erros.tipoProduto && (
                      <div className="ant-form-explain customError">
                        Campo obrigatório
                      </div>
                    )}
                  </div>
                  <div className="col-4 editais-destino">
                    <span className="required-asterisk">*</span>
                    <label className="col-form-label pb-3">
                      Edital de destino
                    </label>
                    <Field
                      component={StatefulMultiSelect}
                      name="editais_destino"
                      selected={values.editais_destino_selecionados || []}
                      options={formatarParaMultiselect(opcoesEditaisDestino)}
                      onSelectedChanged={(values_) => {
                        form.change(`editais_destino_selecionados`, values_);
                        setErros({
                          ...erros,
                          editaisDestino: values_.length === 0,
                        });
                      }}
                      disableSearch={true}
                      overrideStrings={{
                        selectSomeItems: "Selecione um edital",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos",
                      }}
                      disabled={desabilitarCampos}
                    />
                    {erros.editaisDestino && (
                      <div className="ant-form-explain">Campo obrigatório</div>
                    )}
                  </div>
                  <div className="col-4" />
                </div>
                <div className="row mb-3">
                  <div className="col-12 outras-informacoes">
                    <Field
                      component={TextArea}
                      placeholder="Descreva mais informações do produto ou edital..."
                      label={"Outras informações"}
                      name="outras_informacoes"
                      disabled={desabilitarCampos}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="row mb-3 mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setProdutosEditaisSelecionados([]);
                        setOpcoesProdutosEditais([]);
                        setDesabilitarCampos(true);
                        closeModal();
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Vincular"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </Modal.Footer>
            </form>
          )}
        />
      </Spin>
    </Modal>
  );
};
