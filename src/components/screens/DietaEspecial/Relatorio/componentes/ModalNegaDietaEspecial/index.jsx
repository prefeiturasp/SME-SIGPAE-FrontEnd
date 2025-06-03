import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";
import Botao from "../../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import Select from "../../../../../Shareable/Select";
import {
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import { agregarDefault } from "../../../../../../helpers/utilities";
import { formataMotivos } from "./helper";

export default class ModalNegarSolicitacao extends Component {
  constructor(props) {
    super(props);
    this.state = { motivosNegacao: [] };
  }

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

  componentDidMount = async () => {
    const motivosNegacao = await this.props.getMotivos();
    this.setState({
      motivosNegacao: agregarDefault(
        formataMotivos(motivosNegacao.results || motivosNegacao.data?.results)
      ),
    });
  };

  render() {
    const { motivosNegacao } = this.state;
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
                    <Field
                      component={Select}
                      label="Motivo"
                      name="motivo_negacao"
                      options={motivosNegacao}
                      required
                      validate={required}
                    />
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
