import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ texto, disabled, guia, onSubmit, reposicao }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (
      ["Reposição total", "Reposição parcial"].includes(guia.status) &&
      !reposicao
    ) {
      setShow(true);
    } else {
      onSubmit();
    }
  };

  const handleSim = () => {
    onSubmit();
  };

  return (
    <>
      <Botao
        texto={texto}
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        disabled={disabled}
        onClick={handleShow}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <p>
            Ao finalizar a edição de conferência desta Guia de Remessa, o
            registro de reposição será apagado. Deseja continuar?
          </p>
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
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
            onClick={handleSim}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
