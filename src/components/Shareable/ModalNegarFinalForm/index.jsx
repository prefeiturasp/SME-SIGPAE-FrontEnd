import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import CKEditorField from "components/Shareable/CKEditorField";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { SolicitacaoAlimentacaoContext } from "context/SolicitacaoAlimentacao";
import {
  peloMenosUmCaractere,
  textAreaRequired,
} from "helpers/fieldValidators";
import { composeValidators, getError } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";

export const ModalNegarFinalForm = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    solicitacao,
    endpoint,
    loadSolicitacao,
    tipoSolicitacao,
  } = props;
  const [justificativa, setJustificativa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const solicitacaoAlimentacaoContext = useContext(
    SolicitacaoAlimentacaoContext
  );

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    const resp = await endpoint(solicitacao.uuid, values, tipoSolicitacao);
    if (resp.status === HTTP_STATUS.OK) {
      toastSuccess("Solicitação negada com sucesso!");
      closeModal();
      if (loadSolicitacao) {
        const response = await loadSolicitacao(solicitacao.uuid);
        if (response && response.status === HTTP_STATUS.OK) {
          solicitacaoAlimentacaoContext.updateSolicitacaoAlimentacao(
            response.data
          );
        }
      }
    } else {
      closeModal();
      toastError(`Houve um erro ao negar solicitação: ${getError(resp.data)}`);
    }

    setIsSubmitting(false);
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Deseja negar a solicitação?</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row">
                <div className="form-group col-12">
                  <Field
                    component={CKEditorField}
                    label="Justificativa"
                    name="justificativa"
                    dataTestId="justificativa-editor"
                    required
                    validate={composeValidators(
                      textAreaRequired,
                      peloMenosUmCaractere
                    )}
                    onChange={(_, editor) => {
                      const value_ = editor.getData();

                      form.change("justificativa", value_);
                      setJustificativa(value_);
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
                disabled={
                  justificativa === "" ||
                  justificativa === undefined ||
                  isSubmitting
                }
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
