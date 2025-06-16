import moment from "moment";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import { trocaAcentuadasPorSemAcento } from "src/helpers/utilities";
import "./style.scss";

const FORM_NAME = "buscaRequisicoesDilog";

export default ({ setFiltros, setGuias, setTotal, inicioResultado }) => {
  const [initialValues] = useState({});

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.nome_unidade)
      filtros.nome_unidade = trocaAcentuadasPorSemAcento(filtros.nome_unidade);
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-requisicoes-listagem">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  apenasNumeros
                  label="N° da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o Nº da Requisição"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  apenasNumeros
                  label="N° da Guia de Remessa"
                  name="numero_guia"
                  placeholder="Digite o Nº da Guia"
                  className="input-busca-produto"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Selecionar Período de Entrega"
                  name="data_inicial"
                  className="data-inicial"
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
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome da UE"
                  name="nome_unidade"
                  placeholder="Digite o Nome da UE"
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
                  setGuias(undefined);
                  setTotal(undefined);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
