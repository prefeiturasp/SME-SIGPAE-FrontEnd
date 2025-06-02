import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

type ModalBaixarNotificaocesType = {
  show: boolean;
  handleClose: () => void;
  salvarRascunhoEBaixarNotificacoes: () => Promise<void>;
};

export const ModalBaixarNotificaoces = ({
  ...props
}: ModalBaixarNotificaocesType) => {
  const { show, handleClose, salvarRascunhoEBaixarNotificacoes } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Salvar Relatório e Baixar Notificações</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja salvar as informações inseridas no relatório da visita a unidade
        para gerar o(s) documento(s) de notificação para assinatura?
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
          onClick={salvarRascunhoEBaixarNotificacoes}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
