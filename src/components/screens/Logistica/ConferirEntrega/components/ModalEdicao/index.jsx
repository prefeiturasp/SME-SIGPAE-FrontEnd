import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { CONFERENCIA_GUIA, LOGISTICA } from "src/configs/constants";
import { useNavigate } from "react-router-dom";

export default ({ uuid }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSim = () => {
    navigate(`/${LOGISTICA}/${CONFERENCIA_GUIA}?uuid=${uuid}&editar=true`);
  };

  return (
    <>
      <span onClick={handleShow} className="link-acoes green">
        <i className="fas fa-eye" />
        Editar Conferência
      </span>
      |
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <p>
            Ao editar a conferência desta Guia de Remessa, o registro de
            reposição será apagado. Deseja continuar?
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
