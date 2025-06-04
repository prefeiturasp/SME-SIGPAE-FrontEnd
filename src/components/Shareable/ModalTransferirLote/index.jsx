import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export const ModalTransferirLote = ({
  showModal,
  closeModalNao,
  closeModalSim,
  lote,
}) => {
  return (
    <Modal backdrop={"static"} dialogClassName="modal-90w" show={showModal}>
      <Modal.Header closeButton={false}>
        <Modal.Title>Transferência de Lote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <p className="pergunta">
              O lote {lote.nome} está associado à empresa{" "}
              {lote.terceirizada.nome_fantasia}. As solicitações pendentes e
              dietas vigentes serão transferidas para esta nova empresa. Deseja
              efetivar a transferência do lote?
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="row mt-4">
          <div className="col-12">
            <Botao
              texto="Não"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => closeModalNao(lote)}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
            <Botao
              texto="Sim"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              onClick={closeModalSim}
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTransferirLote;
