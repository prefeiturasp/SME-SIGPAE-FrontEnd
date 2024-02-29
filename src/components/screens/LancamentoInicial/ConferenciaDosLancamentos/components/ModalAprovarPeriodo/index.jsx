import React from "react";
import { Modal } from "react-bootstrap";
import { formatarNomePeriodo } from "../../helper";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";

export const ModalAprovarPeriodo = ({ ...props }) => {
  const { showModal, setShowModal, periodoGrupo, aprovarPeriodo } = props;
  const nomePeridoFormatado = formatarNomePeriodo(
    periodoGrupo.nome_periodo_grupo
  );

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Aprovar Período</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <p>
              Deseja aprovar os lançamentos do{" "}
              <b>Período {nomePeridoFormatado}</b>?
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
              aprovarPeriodo(nomePeridoFormatado);
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
