import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { INSUCESSO_ENTREGA, LOGISTICA } from "src/configs/constants";
import { registraInsucessoDeEntrega } from "src/services/logistica.service";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export default ({ values, disabled }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSim = () => {
    setLoading(true);
    const payload = { ...values };
    delete payload.data_entrega;
    delete payload.numero_guia;
    delete payload.data_entrega_real;

    registraInsucessoDeEntrega(payload)
      .then(() => {
        toastSuccess("Insucesso de entrega registrado.");
        setShow(false);
        setLoading(false);
        goToInsucesso();
      })
      .catch((e) => {
        toastError(e.response.data.detail);
        setShow(false);
        setLoading(false);
      });
  };

  const goToInsucesso = () => {
    navigate(`/${LOGISTICA}/${INSUCESSO_ENTREGA}`);
  };

  return (
    <>
      <Botao
        texto="Registrar"
        type={BUTTON_TYPE.SUBMIT}
        style={BUTTON_STYLE.GREEN}
        className="float-end ms-3"
        onClick={handleShow}
        disabled={disabled}
      />

      <Modal show={show} onHide={handleClose}>
        <Spin tip="Carregando..." spinning={loading}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação de registro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Deseja registrar o insucesso de entrega?</p>
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
        </Spin>
      </Modal>
    </>
  );
};
