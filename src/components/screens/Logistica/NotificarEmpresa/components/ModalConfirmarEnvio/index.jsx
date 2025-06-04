import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
export default ({ values, handleClose, enviarNotificacao }) => {
  return (
    <Modal
      show={values ? true : false}
      onHide={handleClose}
      dialogClassName="modal-envio-notificacao"
    >
      <Modal.Header closeButton>
        <Modal.Title>Salvar e Enviar Notificação</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja encaminhar a notificação para a assinatura do Fiscal do Contrato?
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
            enviarNotificacao(values);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
