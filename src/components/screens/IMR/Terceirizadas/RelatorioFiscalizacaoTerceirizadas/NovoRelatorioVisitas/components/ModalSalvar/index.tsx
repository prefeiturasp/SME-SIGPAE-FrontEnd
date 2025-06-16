import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  EscolaLabelInterface,
  NovoRelatorioVisitasFormInterface,
} from "interfaces/imr.interface";

type ModalSalvarType = {
  show: boolean;
  handleClose: () => void;
  salvar: (_values: NovoRelatorioVisitasFormInterface) => Promise<void>;
  values: NovoRelatorioVisitasFormInterface;
  escolaSelecionada: EscolaLabelInterface;
};

export const ModalSalvar = ({ ...props }: ModalSalvarType) => {
  const { show, handleClose, salvar, values, escolaSelecionada } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Enviar Relatório de Fiscalização</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja enviar seu relatório de fiscalização da visita a Unidade
        Educacional: <b>{escolaSelecionada?.label}</b>, para avaliação de CODAE?
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
