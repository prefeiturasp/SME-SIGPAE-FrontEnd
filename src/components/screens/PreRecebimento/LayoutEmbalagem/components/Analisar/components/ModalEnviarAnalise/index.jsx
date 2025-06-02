import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
export default ({ show, handleClose, enviar }) => {
  return (
    <Modal
      show={show ? true : false}
      onHide={handleClose}
      dialogClassName="modal-enviar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Enviar para o Fornecedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja enviar sua avaliação dos Layouts das Embalagens para o
        Fornecedor?
      </Modal.Body>
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
            enviar();
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
