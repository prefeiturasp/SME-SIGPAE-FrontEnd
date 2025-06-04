import React from "react";
import { Modal } from "react-bootstrap";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";

const ModalExclusaoVinculo = ({
  show,
  toggleShow,
  vinculo,
  deletarVinculo,
}) => {
  const handleClose = () => {
    toggleShow(false, null);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-exclusao-vinculo"
    >
      <Modal.Header closeButton>
        <Modal.Title>Deseja remover Perfil de Acesso do Usuário?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Após removido, o usuário não terá mais acesso ao SIGPAE.
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
          onClick={() => {
            deletarVinculo(vinculo);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalExclusaoVinculo;
