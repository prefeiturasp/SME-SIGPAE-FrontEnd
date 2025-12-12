import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { distribuidorAltera } from "src/services/logistica.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export default ({
  show,
  setShow,
  form,
  handleCloseAll,
  updatePage,
  solicitacao,
  values,
}) => {
  const handleClose = () => setShow(false);

  const enviarSolicitacao = async () => {
    try {
      const payload = { ...values };
      payload.requisicao = solicitacao.uuid;
      const res = await distribuidorAltera(payload);
      if (res.status === 201) {
        setShow(false);
        handleCloseAll();
        toastSuccess("Sua solicitação foi enviada e será analisada pela CODAE");
        updatePage();
      } else {
        toastError("Houve um erro ao solicitar a alteração de requisição.");
      }
    } catch {
      toastError("Houve um erro ao solicitar a alteração de requisição.");
    }
  };

  return (
    <>
      <Botao
        texto="Enviar"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        onClick={form.submit}
        className="float-end ms-3"
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Solicitação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja confirmar o envio da solicitação de alteração para a CODAE?
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
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.GREEN}
            onClick={enviarSolicitacao}
            className="ms-3"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
