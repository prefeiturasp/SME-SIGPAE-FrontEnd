import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export default ({ guia, handleClose, handleSim }) => {
  return (
    <Modal show={guia ? true : false} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> Excluir Vínculo </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Deseja realmente excluir o vínculo da Guia Nº {guia.numero_guia}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Cancelar"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => handleClose()}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Excluir Vínculo"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => handleSim(guia)}
        />
      </Modal.Footer>
    </Modal>
  );
};
