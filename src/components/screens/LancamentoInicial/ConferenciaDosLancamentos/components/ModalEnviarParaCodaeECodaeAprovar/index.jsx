import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { usuarioEhMedicao } from "src/helpers/utilities";

export const ModalEnviarParaCodaeECodaeAprovar = ({ ...props }) => {
  const { showModal, setShowModal, aprovarSolicitacaoMedicao } = props;

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {usuarioEhMedicao() ? "Aprovar Medição" : "Enviar para CODAE"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <p>
              {usuarioEhMedicao()
                ? "Deseja aprovar a Medição Inicial?"
                : "Deseja aprovar e enviar a Medição para análise da CODAE?"}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="col-12">
          <Botao
            className="float-end"
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => {
              aprovarSolicitacaoMedicao();
              setShowModal(false);
            }}
            style={BUTTON_STYLE.GREEN}
          />
          <Botao
            className="float-end me-2"
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => setShowModal(false)}
            style={BUTTON_STYLE.GREEN_OUTLINE}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
