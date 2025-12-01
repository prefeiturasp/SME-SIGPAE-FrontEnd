import React from "react";
import { Modal } from "react-bootstrap";
import HTTP_STATUS from "http-status-codes";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export const ModalExcluirEmail = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    emailDict,
    endpoint,
    modulo,
    buscarTerceirizadas,
  } = props;

  const onClickSim = async () => {
    const response = await endpoint(emailDict.uuid);
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      toastSuccess("E-mail excluído com sucesso!");
      buscarTerceirizadas(1, emailDict.modulo);
      closeModal();
    } else {
      toastError(`Houve um erro ao excluir e-mail!`);
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Excluir e-mail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 mt-3 mb-3 px-0">
          <span>Deseja excluir este e-mail do módulo de {modulo}?</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          dataTestId="botao-cancelar"
          className="ms-3"
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={closeModal}
          style={BUTTON_STYLE.GREEN_OUTLINE}
        />
        <Botao
          dataTestId="botao-confirmar"
          className="ms-3 me-3"
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          onClick={() => onClickSim()}
        />
      </Modal.Footer>
    </Modal>
  );
};
