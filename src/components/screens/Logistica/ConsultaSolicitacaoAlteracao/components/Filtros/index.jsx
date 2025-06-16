import moment from "moment";
import React from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";

const FORM_NAME = "buscaSolicitacaoAlteracao";

export default ({
  setFiltros,
  setSolicitacoes,
  numeroSolicitacaoInicial,
  inicioResultado,
}) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.motivos) {
      filtros.motivos = filtros.motivos.toString();
    }
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-solicitacao-alteracao">
      <Form
        onSubmit={onSubmit}
        initialValues={{ numero_solicitacao: numeroSolicitacaoInicial }}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Nº da Solicitação de Alteração"
                  name="numero_solicitacao"
                  placeholder="Digite o Nº da Solicitação"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Nº da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o Nº da Requisição"
                  className="input-busca-produto"
                  apenasNumeros
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Selecionar Período de Entrega"
                  name="data_inicial"
                  className="input-data"
                  placeholder="De"
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
                  className="input-data"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <Field
                  label="Motivo de Alteração"
                  component={MultiSelect}
                  disableSearch
                  name="motivos"
                  multiple
                  nomeDoItemNoPlural="status"
                  options={[
                    {
                      value: "ALTERAR_DATA_ENTREGA",
                      label: "Alterar data de entrega",
                    },
                    {
                      value: "ALTERAR_QTD_ALIMENTO",
                      label: "Alterar quantidade de alimento",
                    },
                    {
                      value: "ALTERAR_ALIMENTO",
                      label: "Alterar alimento",
                    },
                    { value: "OUTROS", label: "Outros" },
                  ]}
                />
              </div>
              <div className="col">
                <Field
                  component={InputText}
                  label="Nome do Distribuidor"
                  name="nome_distribuidor"
                  placeholder="Digite o Nome do Distribuidor"
                  className="input-busca-produto"
                />
              </div>
            </div>

            <div className="mt-4 mb-4" ref={inicioResultado}>
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
                  form.reset({});
                  setSolicitacoes(undefined);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
