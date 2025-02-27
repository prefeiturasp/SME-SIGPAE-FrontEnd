import { agregarDefault } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { required } from "../../../helpers/fieldValidators";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";
import Select from "../Select";
import { TextArea } from "../TextArea/TextArea";
import { toastError, toastSuccess } from "../Toast/dialogs";

export const ModalNaoValidarSolicitacao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    uuid,
    motivosDREnaoValida,
    tipoSolicitacao,
    endpoint,
    loadSolicitacao,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {};

  const naoValidarSolicitacao = async (uuid, values) => {
    setIsLoading(true);

    if (!values.motivo_cancelamento) {
      toastError("O campo motivo é obrigatório");
      setIsLoading(false);
      return;
    }
    if (!values.justificativa) {
      toastError("O campo Justificativa é obrigatório");
      setIsLoading(false);
      return;
    }

    const resp = await endpoint(
      uuid,
      {
        justificativa: `${
          motivosDREnaoValida.find(
            (motivo) => motivo.uuid === values.motivo_cancelamento
          ).nome
        } - ${values.justificativa}`,
      },
      tipoSolicitacao
    );
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("Solicitação não validada com sucesso!");
      if (loadSolicitacao) {
        loadSolicitacao(uuid, tipoSolicitacao);
      }
    } else {
      toastError(resp.detail);
    }
    setIsLoading(false);
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Deseja não validar solicitação?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-row">
                <div className="form-group col-12">
                  <Field
                    component={Select}
                    dataTestId="select-motivo-cancelamento"
                    name="motivo_cancelamento"
                    label="Motivo"
                    naoDesabilitarPrimeiraOpcao
                    options={agregarDefault(motivosDREnaoValida)}
                    required
                    validate={required}
                  />
                </div>
                <div className="form-group col-12">
                  <Field
                    component={TextArea}
                    dataTestId="textarea-justificativa"
                    placeholder="Obrigatório"
                    label="Justificativa"
                    name="justificativa"
                    validate={required}
                    required
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Não"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto="Sim"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => {
                  naoValidarSolicitacao(uuid, values);
                }}
                disabled={isLoading}
                style={BUTTON_STYLE.GREEN}
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
