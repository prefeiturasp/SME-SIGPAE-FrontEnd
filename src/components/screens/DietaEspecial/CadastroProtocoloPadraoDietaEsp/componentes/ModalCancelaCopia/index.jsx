import React from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import { Link } from "react-router-dom";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ showModal, closeModal }) => {
  return (
    <Modal
      dialogClassName="modal-cancela-copia modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Cópia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja cancelar a cópia do protocolo padrão selecionado?
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            closeModal();
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Link
          to={{
            pathname: "/dieta-especial/consultar-protocolo-padrao-dieta",
          }}
        >
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
          />
        </Link>
      </Modal.Footer>
    </Modal>
  );
};
