import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";
import { RegistrarNovaOcorrenciaFormInterface } from "../../interfaces";

type ModalSalvarType = {
  show: boolean;
  handleClose: () => void;
  salvar: (_values: RegistrarNovaOcorrenciaFormInterface) => Promise<void>;
  values: RegistrarNovaOcorrenciaFormInterface;
};

export const ModalSalvar = ({ ...props }: ModalSalvarType) => {
  const { show, handleClose, salvar, values } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Salvar Registro da Ocorrência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja salvar o registro da ocorrência? <br />
        Você ainda poderá editar o registro até o envio da Medição Inicial.
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
          onClick={async () => {
            await salvar(values);
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
