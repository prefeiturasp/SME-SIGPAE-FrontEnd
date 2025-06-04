import HTTP_STATUS from "http-status-codes";
import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import {
  peloMenosUmCaractere,
  required,
  maxLengthProduto,
} from "src/helpers/fieldValidators";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

import { cancelaHomologacao } from "src/services/produto.service";

import "../style.scss";

const maxLength500 = maxLengthProduto(500);

export default class ModalCancelarHomologacaoProduto extends Component {
  getDadosIniciais = () => {
    const produto = this.props.produto;
    if (produto) {
      const dadosIniciais = {
        nome_produto: produto.nome,
        marca: produto.marca.nome,
        fabricante: produto.fabricante.nome,
      };
      return dadosIniciais;
    }
    return {};
  };

  onSubmit = async (values) => {
    const response = await cancelaHomologacao(this.props.idHomologacao, {
      justificativa: values.justificativa,
    });
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Cancelamento enviado com sucesso.");
      this.props.closeModal();
      this.props.onAtualizarHomologacao();
    } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
      toastError("Houve um erro ao cancelar homologação.");
    }
  };

  render() {
    const { showModal, closeModal } = this.props;
    return (
      <Modal
        dialogClassName="modal-cancelar-produto modal-90w"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Envio de Cancelamento da Solicitação de Homologação
          </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={this.onSubmit}
          initialValues={this.getDadosIniciais()}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="form-row">
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Nome do Produto"
                      name="nome_produto"
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                  <div className="col-2">
                    <Field
                      component={InputText}
                      label="Marca"
                      name="marca"
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                  <div className="col-2">
                    <Field
                      component={InputText}
                      label="Fabricante"
                      name="fabricante"
                      disabled={true}
                      required
                      validate={required}
                    />
                  </div>
                </div>
                <div className="form-row row-cancelar">
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
                          maxLength500,
                        ]) {
                          const erro = validator(value);
                          if (erro) return erro;
                        }
                      }}
                      maxLength={501}
                    />
                  </div>
                </div>
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
