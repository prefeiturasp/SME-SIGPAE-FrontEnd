import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { peloMenosUmCaractere, required } from "src/helpers/fieldValidators";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { InputText } from "src/components/Shareable/Input/InputText";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { responderReclamacaoProduto } from "src/services/produto.service";
import "./style.scss";

export default class ModalResponderReclamacao extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount = async () => {};

  onSubmit = async (values) => {
    try {
      const response = await responderReclamacaoProduto(
        this.props.reclamacao.uuid,
        values
      );
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Resposta enviada com Sucesso!");
        this.props.atualizarProduto();
        this.props.closeModal();
      } else {
        toastError("Houve um erro ao responder a reclamação de produto");
        this.props.closeModal();
      }
    } catch (err) {
      toastError("Houve um erro ao responder a reclamação de produto" + err);
      this.props.closeModal();
    }
  };

  render() {
    const { showModal, closeModal, produto } = this.props;
    return (
      <Modal
        dialogClassName="modal-responder-reclamacao modal-90w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header className="border-0">
          <Modal.Title>Responder Questionamento da CODAE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={this.onSubmit}
            initialValues={produto}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="form-row row-filds-produto">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nome do Produto"
                      name="nome"
                      disabled={true}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Marca"
                      name="marca.nome"
                      disabled={true}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Fabricante"
                      name="fabricante.nome"
                      disabled={true}
                    />
                  </div>
                </div>
              </form>
            )}
          />
        </Modal.Body>
        <Form
          onSubmit={this.onSubmit}
          initialValues={{}}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="form-row row-textarea">
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Resposta"
                      name="justificativa"
                      required
                      validate={(value) => {
                        for (let validator of [
                          peloMenosUmCaractere,
                          required,
                        ]) {
                          const erro = validator(value);
                          if (erro) return erro;
                        }
                      }}
                    />
                  </div>
                </div>
                <section className="form-row attachments">
                  <div className="col-9">
                    <div className="card-title fw-bold cinza-escuro">
                      Anexar
                    </div>
                    <div className="text">
                      Anexar fotos, documentos ou relatórios relacionados à
                      reclamação do produto.
                    </div>
                  </div>
                  <div className="col-3 btn">
                    <Field
                      component={ManagedInputFileField}
                      className="inputfile"
                      texto="Anexar"
                      name="anexos"
                      accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                      icone={BUTTON_ICON.ATTACH}
                      toastSuccessMessage="Anexo incluso com sucesso"
                      concatenarNovosArquivos
                    />
                  </div>
                </section>
              </Modal.Body>
              <Modal.Footer className="border-0">
                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Voltar"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={closeModal}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="ms-3"
                    />
                    <Botao
                      texto="Enviar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      disabled={
                        submitting ||
                        peloMenosUmCaractere(values.justificativa) !== undefined
                      }
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
