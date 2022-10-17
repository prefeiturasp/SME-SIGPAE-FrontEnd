import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import {
  getContratoSAFI,
  getListaTermosContratoSAFI
} from "services/safi.service";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import SelectSelecione from "components/Shareable/SelectSelecione";

export default () => {
  const [carregando] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [contratosOptions, setContratosOptions] = useState([]);
  const [collapse, setCollapse] = useState([]);
  const [produtosOptions, setProdutosOptions] = useState([]);

  const onSubmit = () => {};

  const getContratosFiltrado = termoContrato => {
    if (termoContrato) {
      const reg = new RegExp(termoContrato, "iu");
      return contratosOptions.filter(a => reg.test(a.value));
    }
    return contratosOptions;
  };

  const buscaContrato = async values => {
    if (values.termo_contrato) {
      let contrato_uuid = contratos.find(
        c => c.termo_contrato === values.termo_contrato
      ).uuid;
      let response = await getContratoSAFI(contrato_uuid);

      let contrato = response.data;
      values.empresa = contrato.empresa_contratada
        ? contrato.empresa_contratada.nome
        : "";
      values.numero_processo = contrato.processo;

      if (contrato.ata) {
        setProdutosOptions(
          contrato.ata.produtos.map(produto => ({
            ...produto,
            nome: produto.nome_produto
          }))
        );
      }

      document.getElementById("autocomplete-contrato").focus();
      document.getElementById("autocomplete-contrato").blur();
    }
  };

  const selecionaProduto = (uuid, values) => {
    let produto = produtosOptions.find(prod => prod.uuid === uuid);
    if (produto) {
      values.quantidade_total = produto.quantidade_total;
      values.unidade_medida = produto.unidade_medida;
    }
  };

  const toggleCollapse = index => {
    setCollapse({
      [index]: !collapse[index]
    });
  };

  useEffect(() => {
    const buscaListaContratos = async () => {
      const response = await getListaTermosContratoSAFI();
      setContratos(response.data);
      setContratosOptions(
        response.data.map(contrato => ({
          value: contrato.termo_contrato,
          uuid: contrato.uuid
        }))
      );
    };

    buscaListaContratos();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-cronograma">
        <div className="card-body cadastro-cronograma">
          <Form
            onSubmit={onSubmit}
            initialValues={{}}
            validate={() => {}}
            render={({ form, handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-5">
                    <Field
                      component={AutoCompleteField}
                      id="autocomplete-contrato"
                      options={getContratosFiltrado(values.termo_contrato)}
                      label="Nº da Guia de Remessa"
                      name="termo_contrato"
                      className="input-busca-produto"
                      required
                      esconderIcone
                    />
                  </div>
                  <div className="col-1 pl-0">
                    <Botao
                      texto=""
                      icon="fas fa-search"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN}
                      className="botao-pesquisar"
                      onClick={() => buscaContrato(values)}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Empresa"
                      name="empresa"
                      className="input-busca-produto"
                      disabled={true}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nº do Processo SEI - Contratos"
                      name="numero_processo"
                      className="input-busca-produto"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="accordion mt-1" id="accordionCronograma">
                  <div className="card mt-3">
                    <div className={`card-header card-tipo`} id={`heading_1`}>
                      <div className="row card-header-content">
                        <span className="nome-alimento">Dados do Produto</span>
                        <div className="col-1 align-self-center">
                          <button
                            onClick={() => toggleCollapse(1)}
                            className="btn btn-link btn-block text-left px-0"
                            type="button"
                            data-toggle="collapse"
                            data-target={`#collapse_1`}
                            aria-expanded="true"
                            aria-controls={`collapse_1`}
                          >
                            <span className="span-icone-toogle">
                              <i
                                className={
                                  collapse[1]
                                    ? "fas fa-chevron-up"
                                    : "fas fa-chevron-down"
                                }
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      id={`collapse_1`}
                      className="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordionCronograma"
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-5">
                            <Field
                              component={SelectSelecione}
                              naoDesabilitarPrimeiraOpcao
                              options={produtosOptions}
                              label="Status"
                              name="status"
                              required
                              validate={evt => selecionaProduto(evt, values)}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              component={InputText}
                              label="Quantidade Total Programada"
                              name="quantidade_total"
                              className="input-busca-produto"
                              value={"123"}
                              disabled={false}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputText}
                              label="Unidade de Medida"
                              name="unidade_medida"
                              className="input-busca-produto"
                              placeholder="asd"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mt-3">
                    <div className={`card-header card-tipo`} id={`heading_2`}>
                      <div className="row card-header-content">
                        <span className="nome-alimento">
                          Dados do Recebimento
                        </span>
                        <div className="col-1 align-self-center">
                          <button
                            onClick={() => toggleCollapse(2)}
                            className="btn btn-link btn-block text-left px-0"
                            type="button"
                            data-toggle="collapse"
                            data-target={`#collapse_2`}
                            aria-expanded="true"
                            aria-controls={`collapse_2`}
                          >
                            <span className="span-icone-toogle">
                              <i
                                className={
                                  collapse[2]
                                    ? "fas fa-chevron-up"
                                    : "fas fa-chevron-down"
                                }
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      id={`collapse_2`}
                      className="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordionCronograma"
                    >
                      222222222222222222
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mt-4 mb-4">
                  <Botao
                    texto="Voltar"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-right ml-3"
                    //onClick={goToInsucesso}
                    disabled={submitting}
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
