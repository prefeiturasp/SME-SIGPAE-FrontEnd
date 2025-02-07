import HTTP_STATUS from "http-status-codes";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";
import CKEditorField from "../CKEditorField";
import { toastError, toastSuccess } from "../Toast/dialogs";
import "./style.scss";

export const ModalCODAEQuestiona = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    uuid,
    loadSolicitacao,
    endpoint,
    tipoSolicitacao,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const enviarQuestionamento = async (values) => {
    setIsSubmitting(true);

    let resp = "";
    resp = await endpoint(uuid, values, tipoSolicitacao);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      loadSolicitacao(uuid, tipoSolicitacao);
      toastSuccess("Questionamento enviado com sucesso!");
    } else {
      toastError(resp.data.detail);
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      dialogClassName="modal-50w modal-question"
      show={showModal}
      onHide={closeModal}
    >
      <Form
        onSubmit={enviarQuestionamento}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Questionamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="title">
                É possível atender a solicitação com todos os itens previstos no
                contrato?
              </p>
              <div className="row">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label="Observação"
                    placeholder="Alguma observação para a Terceirizada?"
                    name="observacao_questionamento_codae"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="row mt-5">
                <div className="col-12">
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    disabled={isSubmitting}
                    className="ms-3"
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalCODAEQuestiona;
