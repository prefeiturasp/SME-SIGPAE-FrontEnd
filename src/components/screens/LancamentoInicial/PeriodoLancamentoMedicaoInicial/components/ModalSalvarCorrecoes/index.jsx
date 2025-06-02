import React, { useState } from "react";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export default ({ closeModal, showModal, periodoGrupo, onSubmit }) => {
  const [loadingModal, setLoadingModal] = useState(false);

  const onClickSim = async () => {
    setLoadingModal(true);
    await onSubmit();
    closeModal();
    setLoadingModal(false);
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={closeModal}>
      <Spin tip="Carregando..." spinning={loadingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Salvar Correções</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="col-12 my-3 p-0">
            {`Deseja salvar as correções realizadas no Período ${periodoGrupo}?`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12">
            <Botao
              className="float-end"
              texto="Sim"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              onClick={() => onClickSim()}
            />
            <Botao
              className="float-end me-2"
              texto="Não"
              type={BUTTON_TYPE.BUTTON}
              onClick={closeModal}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
          </div>
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};
