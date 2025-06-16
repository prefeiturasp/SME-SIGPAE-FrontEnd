import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";
import {
  maxLengthProduto,
  textAreaRequiredAndAtLeastOneCharacter,
} from "src/helpers/fieldValidators";
import CKEditorField from "../CKEditorField";
import { toastError, toastSuccess, toastWarn } from "../Toast/dialogs";
import { MENSAGEM_VAZIA } from "../TextArea/constants";
import { composeValidators } from "src/helpers/utilities";

const maxLength1500 = maxLengthProduto(1500);

export class ModalCODAEAutoriza extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desabilitarSubmit: !this.props.ehInclusao,
      loading: false,
    };

    this.setDesabilitarSubmit = this.setDesabilitarSubmit.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  setDesabilitarSubmit(value) {
    if (this.props.ehInclusao) {
      this.setState({
        desabilitarSubmit: maxLength1500(value),
      });
    } else {
      this.setState({
        desabilitarSubmit:
          [undefined, null, "", "<p></p>\n"].includes(value) ||
          maxLength1500(value),
      });
    }
  }

  setLoading(value) {
    this.setState({ loading: value });
  }

  async autorizarSolicitacao(uuid, values) {
    if (values.justificativa_autorizacao === MENSAGEM_VAZIA) {
      toastWarn("Justificativa é obrigatória.");
    } else {
      const resp = await this.props.endpoint(
        uuid,
        { justificativa: values.justificativa_autorizacao },
        this.props.tipoSolicitacao
      );
      if (resp.status === HTTP_STATUS.OK) {
        this.props.closeModal();
        toastSuccess("Solicitação autorizada com sucesso!");
        if (this.props.loadSolicitacao) {
          this.props.loadSolicitacao(
            this.props.uuid,
            this.props.tipoSolicitacao
          );
        }
      } else {
        toastError(resp.data.detail);
      }
      this.setLoading(false);
    }
  }

  render() {
    const { showModal, closeModal, uuid, ehInclusao } = this.props;
    return (
      <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
        <Form
          onSubmit={() => {}}
          initialValues={{}}
          render={({ form, handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Deseja autorizar a solicitação?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-row mb-3">
                  <div className="form-group col-12">
                    <Field
                      component={CKEditorField}
                      label="Informações da CODAE"
                      name="justificativa_autorizacao"
                      validate={
                        ehInclusao
                          ? maxLength1500
                          : composeValidators(
                              textAreaRequiredAndAtLeastOneCharacter,
                              maxLength1500
                            )
                      }
                      onChange={(_, editor) => {
                        const value_ = editor.getData();

                        form.change("justificativa_autorizacao", value_);
                        this.setDesabilitarSubmit(value_);
                      }}
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
                    <Botao
                      texto="Sim"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => {
                        this.setLoading(true);
                        this.autorizarSolicitacao(uuid, values);
                      }}
                      disabled={
                        this.state.desabilitarSubmit || this.state.loading
                      }
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
  }
}
