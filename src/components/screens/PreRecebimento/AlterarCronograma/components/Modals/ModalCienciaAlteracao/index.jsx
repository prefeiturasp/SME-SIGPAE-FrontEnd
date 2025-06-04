import React from "react";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
export default ({ show, handleClose, loading, handleSim }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop={"static"}>
      <Spin tip="Carregando..." spinning={loading}>
        <Modal.Header closeButton>
          <Modal.Title> Ciência da Alteração no Cronograma </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>
              Você confirma estar ciente dos novos prazos e quantidades
              alterados pela CODAE?
            </strong>
          </p>
          <p>
            Caso não consiga cumprir os novos prazos e quantidades, acesse o
            Cronograma de Entrega, localize o cronograma programado e solicite
            uma nova alteração.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Ciente"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
            onClick={() => handleSim()}
          />
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};
