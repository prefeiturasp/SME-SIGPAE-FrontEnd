import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { FormApi } from "final-form";
import { NavigateFunction } from "react-router-dom";

type ModalCancelaPreenchimentoType = {
  show: boolean;
  handleClose: () => void;
  form: FormApi<any, Partial<any>>;
  navigate: NavigateFunction;
};

export const ModalCancelaPreenchimento = ({
  ...props
}: ModalCancelaPreenchimentoType) => {
  const { show, handleClose, form, navigate } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Preenchimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja cancelar o preenchimento do Relatório de Fiscalização? <br />
        As informações preenchidas serão perdidas e o formulário não será salvo!
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
          onClick={() => {
            form.reset();
            handleClose();
            navigate(-1);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
