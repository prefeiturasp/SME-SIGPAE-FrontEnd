import React, { useState } from "react";
import { Select } from "antd";
import { Field, Form, FormSpy } from "react-final-form";
import { Modal } from "react-bootstrap";
import HTTP_STATUS from "http-status-codes";
import { composeValidators, getError } from "src/helpers/utilities";
import {
  email as emailValidation,
  required,
} from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { InputText } from "src/components/Shareable/Input/InputText";

export const ModalEditarEmail = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    titulo,
    tituloBotaoCorfirma,
    empresas,
    terceirizada,
    emailDict,
    endpoint,
    buscarTerceirizadas,
  } = props;

  const [desabilitaBotaoSalvar, setDesabilitaBotaoSalvar] = useState(true);

  const onSubmit = async (values) => {
    const payload = {
      email: values.email,
    };
    const response = await endpoint(emailDict.uuid, payload);
    if (response.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("E-mail atualizado com sucesso!");
      buscarTerceirizadas(1, emailDict.modulo);
    } else {
      closeModal();
      if (response.data.email) {
        if (response.data.email[0].includes("existe")) {
          toastError("E-mail já cadastrado para esta empresa");
        } else {
          toastError(response.data.email[0]);
        }
      } else {
        toastError(
          `Houve um erro ao editar e-mail: ${getError(response.data)}`,
        );
      }
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          email: emailDict ? emailDict.email : null,
        }}
        render={({ handleSubmit, errors }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div>
                <label className="mb-1">Empresa</label>
                <Field
                  component={Select}
                  placeholder={terceirizada.razao_social}
                  name="empresa"
                  options={empresas}
                  className="input-add-emails"
                  disabled
                  data-testid="campo-empresa"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1">E-mail</label>
                <Field
                  component={InputText}
                  name="email"
                  placeholder="Digite o e-mail de contato"
                  className="input-add-emails"
                  validate={composeValidators(emailValidation, required)}
                />
                <FormSpy
                  subscription={{ values: true }}
                  onChange={(changes) =>
                    changes.values["email"] !== emailDict.email
                      ? setDesabilitaBotaoSalvar(false)
                      : setDesabilitaBotaoSalvar(true)
                  }
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto={tituloBotaoCorfirma}
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="ms-2"
                disabled={
                  Object.keys(errors).length > 0 || desabilitaBotaoSalvar
                }
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
