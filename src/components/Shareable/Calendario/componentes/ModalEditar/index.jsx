import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { getDDMMYYYfromDate } from "src/helpers/utilities";
import React from "react";
import { Modal } from "react-bootstrap";
import "./style.scss";

export const ModalEditar = ({ ...props }) => {
  const {
    event,
    showModal,
    closeModal,
    setShowModalConfirmarExclusao,
    nomeObjetoNoCalendario,
    nomeObjetoNoCalendarioMinusculo,
  } = props;

  return (
    <Modal
      dialogClassName="modal-editar-sobremesa modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Informações de cadastro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>{nomeObjetoNoCalendario}</strong> para a unidade{" "}
          <strong>{event.title}</strong> dos editais{" "}
          <strong>{event.editais_numeros_virgula}</strong> cadastrada para o dia{" "}
          <strong>{getDDMMYYYfromDate(event.start)}</strong>, por{" "}
          {event.criado_por.nome} em {event.criado_em}.
        </p>
        <p>
          Para alterar o dia de {nomeObjetoNoCalendarioMinusculo} no tipo de
          unidade, você pode apenas arrastar o item para a nova data ou excluir
          este cadastro e criar um novo cadastro no dia desejado.
        </p>
      </Modal.Body>
      <div className="footer">
        <Botao
          texto="Excluir"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            closeModal();
            setShowModalConfirmarExclusao();
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Manter"
          onClick={closeModal}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </div>
    </Modal>
  );
};
