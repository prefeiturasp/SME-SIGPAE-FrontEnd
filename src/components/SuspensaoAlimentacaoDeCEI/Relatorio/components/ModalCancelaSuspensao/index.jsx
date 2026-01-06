import React from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import { escolaCancelaSuspensaoCEI } from "src/services/suspensaoAlimentacaoCei.service";

export default ({ showModal, closeModal, setSolicitacaoSuspensao, uuid }) => {
  const onSubmit = async (values) => {
    try {
      const resp = await escolaCancelaSuspensaoCEI(uuid, values);

      if (resp.status === HTTP_STATUS.OK) {
        setSolicitacaoSuspensao(resp.data);
        closeModal();
        toastSuccess(
          "A solicitação de Suspensão de Alimentação foi cancelada com sucesso!",
        );
      }
    } catch (error) {
      closeModal();
      if (error.response) {
        toastError(getError(error.response.data));
      } else {
        toastError("Erro inesperado ao cancelar suspensão");
      }
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Cancelamento de Suspensão de Alimentação
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <p className="label--red">
                    A solicitação da suspensão de alimentação está autorizada
                    automaticamente. Deseja seguir em frente com o cancelamento?
                  </p>
                </div>
              </div>
              <div className="row ps-3 pe-3">
                <label>* Justificativa</label>
                <Field
                  className="col-12 pb-5"
                  component="textarea"
                  name="justificativa"
                  validate={required}
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Não"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto="Sim"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
