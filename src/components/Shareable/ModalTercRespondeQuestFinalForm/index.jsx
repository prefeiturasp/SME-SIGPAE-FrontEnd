import HTTP_STATUS from "http-status-codes";
import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";
import { TextArea } from "../TextArea/TextArea";
import { toastError, toastSuccess } from "../Toast/dialogs";
import { required } from "../../../helpers/fieldValidators";
import { Field, Form } from "react-final-form";

export const ModalTercRespondeQuestFinalForm = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    resposta_sim_nao,
    endpoint,
    tipoSolicitacao,
    loadSolicitacao,
    solicitacao,
  } = props;

  const onSubmit = async (values) => {
    const response = await endpoint(
      solicitacao.uuid,
      {
        resposta_sim_nao: resposta_sim_nao === "Sim",
        justificativa: values.justificativa,
      },
      tipoSolicitacao
    );
    if (response.status === HTTP_STATUS.OK) {
      closeModal();
      loadSolicitacao();
      toastSuccess("Questionamento respondido com sucesso!");
    } else {
      toastError(response.data.detail);
    }
  };
  return (
    <Modal
      dialogClassName="modal-50w modal-question"
      show={showModal}
      onHide={closeModal}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Resposta: {resposta_sim_nao}</Modal.Title>
            </Modal.Header>
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
                    type={BUTTON_TYPE.SUBMIT}
                    disabled={values.justificativa === undefined || submitting}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
