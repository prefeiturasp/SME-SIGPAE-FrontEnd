import React from "react";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import HTTP_STATUS from "http-status-codes";
import { getError } from "helpers/utilities";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import CKEditorField from "components/Shareable/CKEditorField";

export const ModalCODAEQuestionaKitLancheCEMEI = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    solicitacao,
    endpoint,
    loadSolicitacao,
    tipoSolicitacao
  } = props;

  const onSubmit = async values => {
    const resp = await endpoint(solicitacao.uuid, values, tipoSolicitacao);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("Questionamento enviado com sucesso!");
      if (loadSolicitacao) loadSolicitacao();
    } else {
      closeModal();
      toastError(
        `Houve um erro ao enviar o questionamento: ${getError(resp.data)}`
      );
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Questionamento</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <p className="title">
                    É possível atender a solicitação com todos os itens
                    previstos no contrato?
                  </p>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <Field
                    component={CKEditorField}
                    label="Observação"
                    name="observacao_questionamento_codae"
                    placeholder="Alguma observação para a Terceirizada?"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ml-3"
              />
              <Botao
                texto="Enviar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="ml-3"
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
