import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { DiaLetivoEdicaoDelecaoType } from "../../Editar/interfaces";

interface ModalExcluirDiaLetivoProps {
  event: DiaLetivoEdicaoDelecaoType;
  showModal: boolean;
  closeModal: () => void;
  onConfirm: () => void;
}

export const ModalExcluirDiaLetivo: React.FC<ModalExcluirDiaLetivoProps> = ({
  event,
  showModal,
  closeModal,
  onConfirm,
}) => {
  if (!event) return null;

  return (
    <Modal
      dialogClassName="modal-dados-objeto-dia-letivo"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Excluir Cadastro de Dia Letivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Deseja excluir o cadastro do </strong>
          <span className="fw-bold">dia letivo: {event.dia_letivo}</span>
        </p>
        <hr />
      </Modal.Body>
      <div className="footer">
        <Botao
          texto="Não"
          onClick={closeModal}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3 btn-footer-modal"
        />
        <Botao
          texto="Sim"
          onClick={onConfirm}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3 btn-footer-modal"
        />
      </div>
    </Modal>
  );
};
