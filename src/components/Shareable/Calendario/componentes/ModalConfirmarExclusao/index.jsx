import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getDDMMYYYfromDate } from "src/helpers/utilities";
import React from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { getError } from "src/helpers/utilities";

export const ModalConfirmarExclusao = ({ ...props }) => {
  const {
    event,
    showModal,
    closeModal,
    getObjetosAsync,
    nomeObjetoNoCalendario,
    deleteObjetoAsync,
  } = props;

  const onSubmit = async () => {
    const response = await deleteObjetoAsync(event.uuid);
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      toastSuccess(`Registro excluído com sucesso`);
      closeModal();
      getObjetosAsync();
    } else {
      toastError(getError(response.data));
    }
  };

  return (
    <Modal
      dialogClassName="modal-editar-sobremesa modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Excluir {nomeObjetoNoCalendario}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Deseja realmente excluir o cadastro de{" "}
                <strong>{nomeObjetoNoCalendario}</strong> para a unidade{" "}
                <strong>{event.title}</strong> no dia{" "}
                <strong>{getDDMMYYYfromDate(event.start)}</strong>?
              </p>
            </Modal.Body>
            <div className="footer">
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
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
};
