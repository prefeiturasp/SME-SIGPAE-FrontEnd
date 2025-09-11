import HTTP_STATUS from "http-status-codes";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "../Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import "./style.scss";
import { Field, Form } from "react-final-form";

export const ModalTerceirizadaRespondeQuestionamento = ({ ...props }) => {
  const {
    closeModal,
    endpoint,
    tipoSolicitacao,
    uuid,
    showModal,
    resposta_sim_nao,
    loadSolicitacao,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const responderQuestionamento = async (uuid, values) => {
    setIsSubmitting(true);

    values["resposta_sim_nao"] = resposta_sim_nao === "Sim";
    const response = await endpoint(uuid, values, tipoSolicitacao);
    if (response.status === HTTP_STATUS.OK) {
      closeModal();
      if (loadSolicitacao) loadSolicitacao(uuid, tipoSolicitacao);
      toastSuccess("Questionamento respondido com sucesso!");
    } else {
      toastError(getError(response.data));
    }

    setIsSubmitting(false);
  };

  const onSubmit = () => {};

  return (
    <Modal
      dialogClassName="modal-50w modal-question"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Resposta: {resposta_sim_nao}</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <p className="title">Referente ao questionamento da CODAE</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Field
                    component={TextArea}
                    dataTestId="textarea-observacao-questionamento"
                    label="Observação"
                    placeholder="Qual a sua justificativa para a resposta acima?"
                    name="justificativa"
                    validate={required}
                    required
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
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => {
                      responderQuestionamento(uuid, values);
                    }}
                    disabled={!values.justificativa || isSubmitting}
                    style={BUTTON_STYLE.GREEN}
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
