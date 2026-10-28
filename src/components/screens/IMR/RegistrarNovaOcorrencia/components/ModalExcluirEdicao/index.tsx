import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";

type ModalExcluirEdicaoType = {
  show: boolean;
  handleClose: () => void;
  excluir: () => Promise<void>;
};

export const ModalExcluirEdicao = ({ ...props }: ModalExcluirEdicaoType) => {
  const { show, handleClose, excluir } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Excluir Registro da Ocorrência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja excluir o registro da ocorrência? As informações inseridas serão
        removidas e o registro excluído.
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
          onClick={async () => {
            await excluir();
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
