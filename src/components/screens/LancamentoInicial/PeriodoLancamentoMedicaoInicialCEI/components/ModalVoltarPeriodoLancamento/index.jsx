import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";

export const ModalVoltarPeriodoLancamento = ({ ...props }) => {
  const { showModal, closeModal, history } = props;

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Voltar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="col-12 my-3 p-0">
          {`Deseja realmente sair da página de lançamento em edição? Caso opte por "Sim", você poderá perder os dados inseridos!`}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="col-12">
          <Botao
            className="float-right"
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => history.goBack()}
            style={BUTTON_STYLE.GREEN}
          />
          <Botao
            className="float-right mr-2"
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={closeModal}
            style={BUTTON_STYLE.GREEN_OUTLINE}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
