import React, { useContext, useState } from "react";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import HTTP_STATUS from "http-status-codes";
import { getError, mensagemCancelamento } from "src/helpers/utilities";
import { textAreaRequired } from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { SolicitacaoAlimentacaoContext } from "src/context/SolicitacaoAlimentacao";

export const ModalCancelarKitLancheCEMEI = ({ ...props }) => {
  const { showModal, closeModal, solicitacao, endpoint, loadSolicitacao } =
    props;
  const [justificativa, setJustificativa] = useState("");

  const solicitacaoAlimentacaoContext = useContext(
    SolicitacaoAlimentacaoContext
  );

  const onSubmit = async (values) => {
    const resp = await endpoint(solicitacao.uuid, values);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("Solicitação cancelada com sucesso!");
      if (loadSolicitacao) {
        const response = await loadSolicitacao(solicitacao.uuid);
        if (response.status === HTTP_STATUS.OK) {
          solicitacaoAlimentacaoContext.updateSolicitacaoAlimentacao(
            response.data
          );
        }
      }
    } else {
      closeModal();
      toastError(
        `Houve um erro ao cancelar solicitação: ${getError(resp.data)}`
      );
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cancelamento de Solicitação</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row">
                <div className="row">
                  <div className="col-12">
                    <p className="label--red">
                      {solicitacao && mensagemCancelamento(solicitacao.status)}
                      Deseja seguir em frente com o cancelamento?
                    </p>
                  </div>
                </div>
                <div className="form-group col-12">
                  <Field
                    component={TextArea}
                    placeholder="Obrigatório"
                    label="Justificativa"
                    name="justificativa"
                    required
                    validate={textAreaRequired}
                    inputOnChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        setJustificativa(value);
                      }
                    }}
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
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={justificativa === "" || justificativa === undefined}
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
