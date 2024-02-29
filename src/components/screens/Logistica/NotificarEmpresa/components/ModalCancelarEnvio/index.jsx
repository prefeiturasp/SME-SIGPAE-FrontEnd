import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import "./style.scss";
export default ({ show, handleClose, voltarPagina }) => {
  return (
    <Modal
      show={show ? true : false}
      onHide={handleClose}
      dialogClassName="modal-cancelar-envio-notificacao"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Edição da Notificação</Modal.Title>
      </Modal.Header>
      <Modal.Body>Deseja cancelar a edição da notificação?</Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            voltarPagina();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
