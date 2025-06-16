import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../Shareable/Botao/constants";

export class ModalRemoveContrato extends Component {
  onSubmit(values) {
    this.props.onSubmit(values);
  }

  render() {
    const { showModal, closeModal, values, numeroContrato } = this.props;
    return (
      <Modal
        dialogClassName="modal-cadastro-empresa modal-50w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Encerrar Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja encerrar o <strong>Contrato {numeroContrato}? </strong>
          <br />
          Ao encerrar esse contrato não será possível utilizá-lo em novas
          programações de entregas.
        </Modal.Body>
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
            onClick={() => this.onSubmit(values)}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
