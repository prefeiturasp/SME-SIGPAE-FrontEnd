import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  dilogAceitaAlteracao,
  dilogNegaAlteracao,
} from "src/services/logistica.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { BOTAO_ACEITAR, BOTAO_NEGAR } from "../../constans";

export default ({
  show,
  setShow,
  form,
  handleCloseAll,
  updatePage,
  solicitacao,
  acao,
  values,
}) => {
  const handleClose = () => setShow(false);

  const responderSolicitacao = () => {
    if (acao === BOTAO_ACEITAR) {
      const newValues = {
        justificativa_aceite: values.justificativa,
      };
      aceitarSolicitacao(newValues);
    } else if (acao === BOTAO_NEGAR) {
      const newValues = {
        justificativa_negacao: values.justificativa,
      };
      negarSolicitacao(newValues);
    }
  };

  const aceitarSolicitacao = async (val) => {
    const payload = { ...val };
    const res = await dilogAceitaAlteracao(solicitacao.uuid, payload);
    try {
      if (res.status === 200) {
        setShow(false);
        handleCloseAll();
        toastSuccess("Solicitação de alteração aceita");
        updatePage();
      } else {
        toastError("Houve um erro ao aceitar a solicitação de alteração.");
      }
    } catch (e) {
      setShow(false);
      handleCloseAll();
      toastError("Houve um erro ao negar a solicitação de alteração.");
    }
  };

  const negarSolicitacao = async (val) => {
    const payload = { ...val };
    try {
      const res = await dilogNegaAlteracao(solicitacao.uuid, payload);
      if (res.status === 200) {
        setShow(false);
        handleCloseAll();
        toastSuccess("Solicitação de alteração negada");
        updatePage();
      } else {
        toastError("Houve um erro ao aceitar a solicitação de alteração.");
      }
    } catch (e) {
      setShow(false);
      handleCloseAll();
      toastError("Houve um erro ao negar a solicitação de alteração.");
    }
  };

  const titleText =
    acao === BOTAO_ACEITAR ? "Confirmar Aceite" : "Confirmar Negação";
  const bodyText = acao === BOTAO_ACEITAR ? "aceitar" : "negar";

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
          <Modal.Title> {titleText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja {bodyText} a solicitação de alteração?</Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.BLUE}
            onClick={responderSolicitacao}
            className="ms-3"
          />
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={handleClose}
            style={BUTTON_STYLE.BLUE_OUTLINE}
            className="ms-3"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
