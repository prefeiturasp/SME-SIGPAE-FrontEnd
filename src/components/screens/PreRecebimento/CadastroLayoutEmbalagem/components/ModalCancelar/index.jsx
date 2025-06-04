import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ show, handleClose, handleSim }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop={"static"}>
      <Modal.Header closeButton>
        <Modal.Title> Cancelar Cadastro de Layout </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Deseja cancelar o Cadastro do Layout de Embalagem?</p>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => handleClose()}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => handleSim()}
        />
      </Modal.Footer>
    </Modal>
  );
};
