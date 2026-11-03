import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";

type ModalCancelarEdicaoType = {
  show: boolean;
  handleClose: () => void;
  confirmar: () => void;
};

export const ModalCancelarEdicao = ({ ...props }: ModalCancelarEdicaoType) => {
  const { show, handleClose, confirmar } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Edição da Ocorrência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja cancelar a edição da ocorrência? <br />
        As informações editadas não serão salvas.
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={handleClose}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={confirmar}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
