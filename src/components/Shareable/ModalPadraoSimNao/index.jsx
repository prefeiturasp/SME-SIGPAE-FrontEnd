import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";

export const ModalPadraoSimNao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    tituloModal,
    descricaoModal,
    funcaoSim,
    desabilitaSim
  } = props;

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{tituloModal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{descricaoModal}</Modal.Body>
      <Modal.Footer className="float-right">
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={closeModal}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ml-3"
        />
        <Botao
          texto={
            desabilitaSim ? (
              <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
            ) : (
              "Sim"
            )
          }
          type={BUTTON_TYPE.BUTTON}
          onClick={() => funcaoSim()}
          style={BUTTON_STYLE.GREEN}
          disabled={desabilitaSim}
          className="ml-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
