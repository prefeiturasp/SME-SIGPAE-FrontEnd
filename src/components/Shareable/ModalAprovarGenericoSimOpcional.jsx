import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, FormSpy } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import CKEditorField from "./CKEditorField";

export const ModalAprovarGenericoSimOpcional = ({
  showModal,
  closeModal,
  uuid,
  endpoint,
  loadSolicitacao,
  tipoSolicitacao,
}) => {
  const autorizarSolicitacao = async (uuid, justificativa) => {
    const resp = await endpoint(
      uuid,
      {
        justificativa:
          justificativa && justificativa.length > 0
            ? justificativa
            : "Sem observações por parte da CODAE",
      },
      tipoSolicitacao
    );
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("Solicitação autorizada com sucesso!");
      loadSolicitacao(uuid);
    } else {
      toastError(resp?.detail);
    }
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={closeModal}>
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Deseja autorizar a solicitação?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label="Informações da CODAE"
                    name="justificativa"
                    placeholder="Qual a sua observação para essa decisão?"
                    maxLength={1500}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="row">
                <div className="col-12">
                  <Botao
                    texto="Não"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <FormSpy subscription={{ form: true }}>
                    {({ form }) => (
                      <Botao
                        texto="Sim"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => {
                          const values = form.getState().values;
                          autorizarSolicitacao(uuid, values.justificativa);
                        }}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3"
                      />
                    )}
                  </FormSpy>
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
