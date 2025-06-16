import React, { useRef } from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { getPerfisPorVisao } from "../../helper";

const FORM_NAME = "buscaGestaoAcesso";

export default ({
  setFiltros,
  setShowCadastro,
  visoes,
  perfis,
  visaoUnica,
  desabilitaCadastro,
  qtdLimiteCadastro,
  somenteLeitura,
}) => {
  const initialValues = visaoUnica
    ? {
        visao: visaoUnica,
      }
    : {};
  const inicioResultado = useRef();

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-gestao-acesso">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, values, submitting }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />

            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome do Usuário"
                  name="nome"
                  placeholder="Digite o Nome do Usuário"
                  className="input-busca-produto"
                />
              </div>

              <div className="col-6">
                <Field
                  component={InputText}
                  label="ID do Usuário"
                  name="usuario"
                  placeholder="Digite o ID do Usuário"
                  className="input-busca-produto"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field
                  label="Visão"
                  component={SelectSelecione}
                  dataTestId={"input-visao"}
                  placeholder="Selecione a Visão"
                  name="visao"
                  options={visoes}
                  defaultValue={visaoUnica ? visaoUnica : undefined}
                  disabled={visaoUnica ? true : false}
                />
              </div>
              <div className="col-6">
                <Field
                  label="Perfil de Acesso"
                  component={SelectSelecione}
                  dataTestId={"input-perfil-acesso"}
                  placeholder="Selecione o perfil do Usuário"
                  name="perfil"
                  options={getPerfisPorVisao(values.visao, perfis)}
                />
              </div>
            </div>

            <div className="mt-4 mb-4" ref={inicioResultado}>
              {!somenteLeitura && (
                <Botao
                  texto="Adicionar Acesso"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="float-start"
                  onClick={() => setShowCadastro(true)}
                  disabled={desabilitaCadastro()}
                  tooltipExterno={
                    desabilitaCadastro()
                      ? `É possível manter até ${qtdLimiteCadastro} usuários utilizando o SIGPAE em sua UE.`
                      : ""
                  }
                />
              )}

              <Botao
                texto="Filtrar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
                disabled={submitting}
                onClick={() => inicioResultado.current.scrollIntoView()}
              />

              <Botao
                texto="Limpar"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset(initialValues);
                  setFiltros(initialValues);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
