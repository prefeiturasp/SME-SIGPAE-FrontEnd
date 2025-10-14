import PropTypes from "prop-types";
import React from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

const ModalConfirmacaoSimNao = ({
  showModal,
  closeModal,
  titulo,
  corpo,
  onSimClick,
  onNaoClick,
  disableSimBtn = false,
  textoBtnSim = "Sim",
}) => {
  return (
    <Modal
      dialogClassName="modal-cadastro-empresa modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      {titulo && (
        <Modal.Header closeButton>
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>
      )}
      {corpo && <Modal.Body>{corpo}</Modal.Body>}
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            closeModal();
            onNaoClick();
          }}
          style={BUTTON_STYLE.BLUE_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto={textoBtnSim}
          disabled={disableSimBtn}
          type={BUTTON_TYPE.BUTTON}
          onClick={onSimClick}
          style={BUTTON_STYLE.BLUE}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

ModalConfirmacaoSimNao.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  titulo: PropTypes.string,
  onSimClick: PropTypes.func.isRequired,
  onNaoClick: PropTypes.func,
  corpo: PropTypes.element,
};

ModalConfirmacaoSimNao.defaultProps = {
  onNaoClick: () => {},
};

export default ModalConfirmacaoSimNao;
