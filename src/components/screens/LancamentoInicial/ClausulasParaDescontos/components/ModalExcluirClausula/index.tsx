import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

type ModalProps = {
  uuid: string;
  show: boolean;
  carregando?: boolean;
  handleClose: () => void;
  handleConfirm: (_uuid: string) => void;
};

export function ModalExcluirClausula({
  uuid,
  show,
  carregando = false,
  handleClose,
  handleConfirm,
}: ModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Excluir Cláusula</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Você confirma a exclusão da cláusula selecionada?</p>
        <p>Não será possível aplicar o desconto indicado em novas medições.</p>
      </Modal.Body>

      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => handleClose()}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => handleConfirm(uuid)}
          disabled={carregando}
        />
      </Modal.Footer>
    </Modal>
  );
}
