import HTTP_STATUS from "http-status-codes";
import { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import Botao from "../../../../../Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "../../../../../Shareable/Botao/constants";
import Select from "../../../../../Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";

export default class ModalNegarSolicitacao extends Component {
  onSubmit = async (values) => {
    const { uuid, submitModal } = this.props;
    const resp = await submitModal(uuid, values);
    if (resp.status === HTTP_STATUS.OK) {
      this.props.closeModal();
      toastSuccess("Solicitação negada com sucesso!");
      if (this.props.onNegar) {
        this.props.onNegar();
      }
    } else {
      toastError(resp.data.detail);
    }
  };

  render() {
    const { motivosNegacao } = this.props;
    return (
      <Modal
        dialogClassName="modal-90w"
        show={this.props.showModal}
        onHide={this.props.closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.tituloModal}</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={this.onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row">
                  <div className="col-12">
                    {motivosNegacao ? (
                      <Field
                        component={Select}
                        label="Motivo"
                        name="motivo_negacao"
                        options={motivosNegacao}
                        required
                        validate={required}
                      />
                    ) : (
                      <div>Carregando motivos...</div>
                    )}
                  </div>
                </div>
                <div className="form-row mb-3">
                  <div className="form-group col-12">
                    <Field
                      component={CKEditorField}
                      label="Justificativa"
                      name={this.props.fieldJustificativa}
                      className="form-control"
                      required
                      validate={composeValidators(
                        textAreaRequired,
                        peloMenosUmCaractere
                      )}
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
                      onClick={this.props.closeModal}
                      style={BUTTON_STYLE.DARK_OUTLINE}
                      className="ms-3"
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
  }
}
