import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

export const ModalCancelarCorrecao = ({ ...props }) => {
  const { showModal, setShowModal, cancelarCorrecao } = props;

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Deseja cancelar a solicitação de correção?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <div className="col-12">
          <Botao
            className="float-end"
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => {
              setShowModal(false);
              cancelarCorrecao();
            }}
            style={BUTTON_STYLE.GREEN}
          />
          <Botao
            className="float-end me-2"
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => setShowModal(false)}
            style={BUTTON_STYLE.GREEN_OUTLINE}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
