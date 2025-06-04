import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";
import { FormCadastroEditaisContratosContratoInterface } from "../../../interfaces";

interface ModalEncerrarContratoPropsInterface {
  showModal: boolean;
  closeModal: () => void;
  encerrarContrato: (
    _contrato: FormCadastroEditaisContratosContratoInterface
  ) => Promise<void>;
  contrato: FormCadastroEditaisContratosContratoInterface;
}

export const ModalEncerrarContrato = (
  props: ModalEncerrarContratoPropsInterface
) => {
  const { showModal, closeModal, encerrarContrato, contrato } = props;

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
        Confirma o encerramento do <strong>Contrato {contrato.numero}</strong>?
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
          onClick={() => encerrarContrato(contrato)}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
