import React from "react";
import HTTP_STATUS from "http-status-codes";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export const ModalAprovarSolicitacaoKitLanche = ({ ...props }) => {
  const { showModal, closeModal, solicitacao, endpoint, loadSolicitacao } =
    props;

  const onSubmit = async (values) => {
    values.justificativa =
      values.justificativa && values.justificativa.length > 0
        ? values.justificativa
        : "Sem observações por parte da CODAE";
    const response = await endpoint(solicitacao.uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Solicitação autorizada com sucesso!");
      loadSolicitacao();
    } else {
      toastError(response.data.detail);
    }
    closeModal();
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            dialogClassName=" modal-50w"
            show={showModal}
            onHide={() => {
              values.justificativa = "";
              closeModal();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="modal-alteracao-cardapio-cemei">
                Deseja autorizar a solicitação?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-row">
                <div className="form-group col-12">
                  <Field
                    component={TextArea}
                    placeholder="Qual a sua observação para essa decisão?"
                    label="Informações da CODAE"
                    name="justificativa"
                    maxLength={1500}
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Não"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => {
                  values.justificativa = "";
                  closeModal();
                }}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto="Sim"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => {
                  onSubmit(values);
                }}
                style={BUTTON_STYLE.GREEN}
                className="ms-3"
              />
            </Modal.Footer>
          </Modal>
        </form>
      )}
    </Form>
  );
};
