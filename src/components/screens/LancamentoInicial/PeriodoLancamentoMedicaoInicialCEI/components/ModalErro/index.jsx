import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ showModalErro, setShowModalErro }) => {
  const handleModalClose = () => {
    setShowModalErro(false);
  };

  return (
    <Modal
      dialogClassName="modal-dialog-centered"
      show={showModalErro}
      onHide={handleModalClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Aviso de Erro</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Existem campos a serem corrigidos. Realize as correções para prosseguir
        para a próxima semana.
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Fechar"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => handleModalClose()}
          style={BUTTON_STYLE.GREEN}
          className="float-end"
        />
      </Modal.Footer>
    </Modal>
  );
};
