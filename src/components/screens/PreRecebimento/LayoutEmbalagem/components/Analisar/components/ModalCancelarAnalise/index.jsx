import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
export default ({ show, handleClose, cancelar }) => {
  return (
    <Modal
      show={show ? true : false}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Análise</Modal.Title>
      </Modal.Header>
      <Modal.Body>Deseja cancelar a análise do Layout da Embalagem?</Modal.Body>
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
            cancelar();
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
