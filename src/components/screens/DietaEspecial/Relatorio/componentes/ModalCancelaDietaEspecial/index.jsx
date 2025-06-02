import HTTP_STATUS from "http-status-codes";
import React from "react";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import {
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "../../../../../../helpers/fieldValidators";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { escolaCancelaSolicitacao } from "../../../../../../services/dietaEspecial.service";
import Botao from "../../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import {
  toastSuccess,
  toastError,
} from "../../../../../Shareable/Toast/dialogs";
import { getError } from "../../../../../../helpers/utilities";

const ModalCancelaDietaEspecial = ({
  showModal,
  onCloseModal,
  uuid,
  onCancelar,
}) => {
  const onSubmit = async (values) => {
    const response = await escolaCancelaSolicitacao(uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Solicitação de Dieta Especial cancelada com sucesso!");
      onCancelar();
    } else {
      toastError(
        `Erro ao cancelar Solicitação de Dieta Especial: ${getError(
          response.data
        )}`
      );
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={onCloseModal}>
      <Form
        onSubmit={onSubmit}
        initialValues={{ justificativa: undefined }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={"cancelaDietaEspecial"} />
            <Modal.Header closeButton>
              <Modal.Title>Deseja cancelar a solicitação?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Field
                component={CKEditorField}
                label="Justificativa"
                name="justificativa"
                required
                validate={(value) => {
                  for (let validator of [
                    textAreaRequired,
                    peloMenosUmCaractere,
                    required,
                  ]) {
                    const erro = validator(value);
                    if (erro) return erro;
                  }
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <div className="row mt-4">
                <div className="col-12">
                  <Botao
                    texto="Não"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={onCloseModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                    disabled={submitting}
                  />
                  <Botao
                    texto="Sim"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                    disabled={submitting}
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

export default ModalCancelaDietaEspecial;
