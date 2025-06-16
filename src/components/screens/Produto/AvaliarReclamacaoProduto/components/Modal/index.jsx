import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { peloMenosUmCaractere, required } from "src/helpers/fieldValidators";
import CKEditorField from "src/components/Shareable/CKEditorField";
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
import "./style.scss";
import {
  CODAEPedeAnaliseReclamacao,
  CODAERecusaReclamacao,
  CODAEAceitaReclamacao,
} from "src/services/produto.service";
import { getMensagemSucesso } from "./helpers";

export default class ModalProsseguirReclamacao extends Component {
  onSubmit = async (values) => {
    const { produto, tituloModal } = this.props;
    const homologacaoComReclamacao = produto.homologacoes.find((h) =>
      [
        "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
        "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
      ].includes(h.status)
    );
    const endpoint =
      tituloModal === "Questionar terceirizada"
        ? CODAEPedeAnaliseReclamacao
        : tituloModal === "Recusar reclamação"
        ? CODAERecusaReclamacao
        : CODAEAceitaReclamacao;
    const response = await endpoint(homologacaoComReclamacao.uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(getMensagemSucesso(tituloModal));
      this.props.closeModal();
      this.props.onAtualizarProduto(response.data);
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError("Houve um erro ao registrar a reclamação de produto");
    }
  };

  render() {
    const { showModal, closeModal, tituloModal } = this.props;
    return (
      <Modal
        dialogClassName="modal-reclamacao-produto modal-90w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={this.onSubmit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="form-row row-reclamacao">
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Justificativa"
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
              <Modal.Footer>
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
