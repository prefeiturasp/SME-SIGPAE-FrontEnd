import React, { useState } from "react";
import { Spin, Select } from "antd";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { BAD_REQUEST, CREATED } from "http-status-codes";
import { email } from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  toastSuccess,
  toastError,
} from "components/Shareable/Toast/dialogs.js";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "components/Shareable/Botao/constants";
import { InputText } from "components/Shareable/Input/InputText";
import { createEmailsTerceirizadasPorModulo } from "services/terceirizada.service.js";

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  const [empresaSelect, setEmpresaSelect] = useState();

  const handleAdicionarEmail = async () => {
    setShowModal(true);
  };

  const CadastrarEmail = async (form, values) => {
    const payload = {
      email: values.email,
      terceirizada: empresaSelect,
      modulo: props.modulo,
    };
    try {
      const resultado = await createEmailsTerceirizadasPorModulo(payload);
      if (resultado.status === CREATED) {
        setShowModal(false);
        resetForm(form);
        setEmpresaSelect("");
        toastSuccess("E-mail cadastrado com sucesso!");
        props.atualizaTabela();
      }
    } catch (erro) {
      if (erro.response && erro.response.status === BAD_REQUEST) {
        if (erro.response.data.terceirizada) {
          toastError(erro.response.data.terceirizada[0]);
        } else {
          if (erro.response.data.email) {
            if (erro.response.data.email[0].includes("existe")) {
              toastError("E-mail já cadastrado para esta empresa");
            } else {
              toastError(erro.response.data.email[0]);
            }
          } else {
            toastError("Erro");
          }
        }
      }
    }
  };

  const resetForm = async (form) => {
    await form.change("empresa", null);
    await form.change("email", null);
  };

  return (
    <>
      <div className="filtros-requisicoes-emails">
        <Form
          onSubmit={CadastrarEmail}
          render={({ form, handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="btn-add-emails col-4">
                  <Botao
                    texto="Adicionar E-mails"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    className="float-end ms-3"
                    onClick={() => {
                      handleAdicionarEmail();
                    }}
                  />
                </div>

                <div className="emails-terceirizadas col-8">
                  <Field
                    component={InputText}
                    name="buscar"
                    placeholder="Buscar Empresa ou E-mail cadastrado"
                    className="input-consulta-emails"
                    icone={`${BUTTON_ICON.SEARCH} fa-lg`}
                  />
                </div>
                <OnChange name="buscar">
                  {() => {
                    props.onChange(values);
                  }}
                </OnChange>
              </div>

              <Modal
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                  setEmpresaSelect("");
                  resetForm(form);
                }}
              >
                <Spin tip="Enviando..." spinning={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Adicionar E-mail</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <div>
                        <div>
                          <label className="mb-1">Empresa</label>
                          <Field
                            component={Select}
                            placeholder="Selecione uma empresa cadastrada"
                            name="empresa"
                            options={props.empresas}
                            className="input-add-emails"
                            onChange={(e) => {
                              setEmpresaSelect(e);
                            }}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="mb-1">E-mail</label>
                          <Field
                            component={InputText}
                            name="email"
                            placeholder="Digite o e-mail de contato"
                            className="input-add-emails"
                            validate={email}
                          />
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        setShowModal(false);
                        setEmpresaSelect("");
                        resetForm(form);
                      }}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Adicionar"
                      type={BUTTON_TYPE.SUBMIT}
                      onClick={() => {
                        CadastrarEmail(form, values);
                      }}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-2"
                    />
                  </Modal.Footer>
                </Spin>
              </Modal>
            </form>
          )}
        />
      </div>
    </>
  );
};
