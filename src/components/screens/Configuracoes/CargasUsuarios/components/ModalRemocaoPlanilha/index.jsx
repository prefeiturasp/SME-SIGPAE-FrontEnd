import React from "react";
import { Modal } from "react-bootstrap";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";

const ModalRemocaoPlanilha = ({ show, setShow, planilha, removerPlanilha }) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-remocao-planilha"
    >
      <Modal.Header closeButton>
        <Modal.Title>Deseja remover este arquivo de carga?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Após removido, não será possível executar ou fazer download do arquivo
      </Modal.Body>
      <Modal.Footer>
        <Botao
          dataTestId="botao-cancelar"
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={handleClose}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          dataTestId="botao-remover"
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            removerPlanilha(planilha);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemocaoPlanilha;
