import HTTP_STATUS from "http-status-codes";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form, FormSpy } from "react-final-form";
import { textAreaRequiredAndAtLeastOneCharacter } from "../../helpers/fieldValidators";
import { toastError, toastSuccess, toastWarn } from "./Toast/dialogs";
import Botao from "./Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "./Botao/constants";
import { MENSAGEM_VAZIA } from "./TextArea/constants";
import CKEditorField from "./CKEditorField";

const ModalNegarSolicitacao = ({
  showModal,
  closeModal,
  uuid,
  endpoint,
  tipoSolicitacao,
  loadSolicitacao,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const negarSolicitacaoEscolaOuDre = async (uuid, justificativa) => {
    if (justificativa === MENSAGEM_VAZIA) {
      toastWarn("Justificativa é obrigatória.");
    } else {
      const resp = await endpoint(uuid, { justificativa }, tipoSolicitacao);
      if (resp.status === HTTP_STATUS.OK) {
        closeModal();
        toastSuccess("Solicitação negada com sucesso!");
        if (loadSolicitacao) {
          loadSolicitacao(uuid, tipoSolicitacao);
        }
      } else {
        toastError(resp.data.detail);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Deseja negar a solicitação?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-row mb-3">
                <div className="form-group col-12">
                  <Field
                    component={CKEditorField}
                    label="Justificativa"
                    name="justificativa"
                    required
                    validate={textAreaRequiredAndAtLeastOneCharacter}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="row mt-4">
                <div className="col-12">
                  <Botao
                    texto="Não"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <FormSpy subscription={{ values: true }}>
                    {({ values }) => (
                      <Botao
                        texto="Sim"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => {
                          setIsSubmitting(true);
                          negarSolicitacaoEscolaOuDre(
                            uuid,
                            values.justificativa
                          );
                        }}
                        style={BUTTON_STYLE.GREEN}
                        disabled={isSubmitting}
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

export default ModalNegarSolicitacao;
