import React, { useRef } from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import { InputText } from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import "./styles.scss";
import SelectSelecione from "components/Shareable/SelectSelecione";
import {
  baixarExcelModeloNaoServidor,
  baixarExcelModeloServidor,
  baixarExcelModeloUEParceira,
} from "services/cargaUsuario.service";
import { required } from "helpers/fieldValidators";
import moment from "moment";
import { InputComData } from "components/Shareable/DatePicker";
import { OPTIONS_STATUS } from "../../constants";

const FORM_NAME = "buscaCargasUsuarios";

export default ({ setFiltros, setPlanilhas, setShowCadastro, servidores }) => {
  const initialValues = {};
  const inicioResultado = useRef();

  const OPTIONS_MODELO = [
    ...(!servidores
      ? [
          {
            uuid: "NAO_SERVIDOR",
            nome: "Não Servidor",
          },
        ]
      : []),
    {
      uuid: "SERVIDOR",
      nome: "Servidor",
    },
    {
      uuid: "UE_PARCEIRA",
      nome: "UEs Parceiras",
    },
  ];

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-cargas-usuarios">
      <div className="row mb-2">
        <Botao
          texto="Modelo Planilha Servidores"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="float-right ml-3"
          icon="fas fa-download"
          onClick={baixarExcelModeloServidor}
        />
        {!servidores && (
          <Botao
            texto="Modelo Planilha Não Servidores"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-right ml-3"
            icon="fas fa-download"
            onClick={baixarExcelModeloNaoServidor}
          />
        )}
        <Botao
          texto="Modelo Planilha UEs Parceiras"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="float-right ml-3"
          icon="fas fa-download"
          onClick={baixarExcelModeloUEParceira}
        />
      </div>

      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values, errors }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />

            <div className="row">
              <div className="col-6">
                <Field
                  label="Modelo da Planilha"
                  component={SelectSelecione}
                  placeholder="Selecione o Modelo de Planilha"
                  name="modelo"
                  options={OPTIONS_MODELO}
                  required
                  validate={required}
                />
              </div>

              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Selecione o Período de Inserção"
                  name="data_inicial"
                  className="data-inicial"
                  placeholder="De"
                  writable={false}
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : null
                  }
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  className="data-final"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  writable={false}
                  strictParsing
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome do Arquivo"
                  name="nome"
                  placeholder="Digite o Nome do Arquivo"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  label="Status"
                  component={SelectSelecione}
                  placeholder="Selecione o Status"
                  name="status"
                  options={OPTIONS_STATUS}
                />
              </div>
            </div>

            <div className="mt-4 mb-4" ref={inicioResultado}>
              <Botao
                texto="Inserir Carga de Usuários"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                className="float-left"
                icon="fas fa-upload"
                onClick={() => setShowCadastro(true)}
              />

              <Botao
                texto="Filtrar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-right ml-3"
                disabled={submitting || Object.keys(errors).length > 0}
                onClick={() => inicioResultado.current.scrollIntoView()}
              />

              <Botao
                texto="Limpar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-right ml-3"
                onClick={() => {
                  form.reset(initialValues);
                  setFiltros(null);
                  setPlanilhas([]);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
