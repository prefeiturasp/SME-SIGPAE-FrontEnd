import React from "react";
import { Modal } from "react-bootstrap";
import "antd/dist/antd.min.css";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
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
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={handleClose}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ml-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            removerPlanilha(planilha);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ml-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemocaoPlanilha;
