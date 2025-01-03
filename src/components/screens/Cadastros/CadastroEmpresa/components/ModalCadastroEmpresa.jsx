import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants.js";

export class ModalCadastroEmpresa extends Component {
  onSubmit(values) {
    this.props.onSubmit(values);
  }

  render() {
    const { showModal, closeModal, values, titulo } = this.props;
    return (
      <Modal
        dialogClassName="modal-cadastro-empresa modal-50w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você confirma o cadastro desta Empresa?</Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={closeModal}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ms-3"
          />
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => {
              this.onSubmit(values);
              closeModal();
            }}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
