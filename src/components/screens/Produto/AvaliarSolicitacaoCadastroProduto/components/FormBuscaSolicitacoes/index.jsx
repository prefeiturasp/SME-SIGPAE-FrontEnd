import moment from "moment";
import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { useNavigationType } from "react-router-dom";

import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import { getNomesProdutosSolicitacaoInclusao } from "src/services/produto.service";

const FORM_NAME = "buscaAvaliarSolicCadProd";

const FormBuscaSolicitacao = ({ initialValues, onSubmit }) => {
  const [nomesProdutosFiltrado, setNomesProdutosFiltrado] = useState([]);
  const [nomesProdutos, setNomesProdutos] = useState([]);

  const navigationType = useNavigationType();

  useEffect(() => {
    const fetchData = async () => {
      const resposta = await getNomesProdutosSolicitacaoInclusao();
      if (resposta.status === HTTP_STATUS.OK) {
        setNomesProdutos(resposta.data);
      }
    };
    fetchData();
  }, []);

  const onSearch = (searchText) => {
    if (searchText.length) {
      const reg = new RegExp(searchText, "i");
      setNomesProdutosFiltrado(nomesProdutos.filter((nome) => reg.test(nome)));
    }
  };
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={navigationType === "POP" && initialValues}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} className="busca-produtos">
          <FinalFormToRedux form={FORM_NAME} />
          <div className="form-row">
            <div className="col-lg-6">
              <Field
                component={AutoCompleteField}
                dataSource={nomesProdutosFiltrado}
                placeholder="Digite nome do produto"
                label="Nome do Produto"
                className="input-busca-produto"
                onSearch={onSearch}
                name="nome_produto"
              />
            </div>
            <div className="col-lg-6">
              <Field
                component={Select}
                naoDesabilitarPrimeiraOpcao
                options={[
                  { uuid: "", nome: "Todos" },
                  {
                    uuid: "AGUARDANDO_CONFIRMACAO",
                    nome: "Aguardando confirmação",
                  },
                  { uuid: "CONFIRMADA", nome: "Confirmada" },
                ]}
                label="Situação do Pedido"
                name="status"
              />
            </div>
            <div className="col col-lg-9 col-xl-6">
              <div className="row">
                <label className="ms-3">Data da solicitação</label>
              </div>
              <div className="row">
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_inicial"
                    className="data-inicial"
                    labelClassName="datepicker-fixed-padding"
                    placeholder="De"
                    minDate={null}
                    maxDate={
                      values.data_final
                        ? moment(values.data_final, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                  />
                </div>
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_final"
                    labelClassName="datepicker-fixed-padding"
                    popperPlacement="bottom-end"
                    placeholder="Até"
                    minDate={
                      values.data_inicial
                        ? moment(values.data_inicial, "DD/MM/YYYY")._d
                        : null
                    }
                    maxDate={moment()._d}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-4">
            <Botao
              texto="Consultar"
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
                form.reset({
                  nome_produto: undefined,
                  status: undefined,
                  data_final: undefined,
                  data_inicial: undefined,
                });
              }}
            />
          </div>
        </form>
      )}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    initialValues: state.finalForm[FORM_NAME],
  };
};

export default connect(mapStateToProps)(FormBuscaSolicitacao);
