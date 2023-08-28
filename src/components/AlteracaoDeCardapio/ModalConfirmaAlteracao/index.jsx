import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "../../Shareable/Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../Shareable/Botao/constants";

export default (props) => (
  <Modal show={props.showModal} onHide={props.closeModal}>
    <Modal.Header closeButton>
      <Modal.Title>Atenção</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Os cardápios são elaborados para atender as necessidades nutricionais dos
      alunos, por este motivo não é recomendado alterar refeição por lanche mais
      de uma vez no mês.
    </Modal.Body>
    <Modal.Footer>
      <Botao
        texto="SIM"
        type={BUTTON_TYPE.BUTTON}
        onClick={() => {
          props.onSubmit(props.values);
          props.closeModal();
        }}
        style={BUTTON_STYLE.BLUE}
        className="ml-3"
      />
      <Botao
        texto="NÃO"
        type={BUTTON_TYPE.BUTTON}
        onClick={props.closeModal}
        style={BUTTON_STYLE.BLUE}
        className="ml-3"
      />
    </Modal.Footer>
  </Modal>
);
