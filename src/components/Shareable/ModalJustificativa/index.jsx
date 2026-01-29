import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { peloMenosUmCaractere, required } from "src/helpers/fieldValidators";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { InputText } from "src/components/Shareable/Input/InputText";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";

import "./style.scss";
import ModalSuspensaoProdutoEdital from "../ModalSuspensaoProdutoEdital";

const ModalJustificativa = ({
  showModal,
  closeModal,
  onSubmit,
  titulo,
  state,
  comAnexo = false,
  labelJustificativa = "Justificativa",
  escola,
  terceirizada,
  produto,
  uuidReclamacao,
  showModalSuspensao,
  abreModalSuspensao,
  closeModalSuspensao,
}) => {
  return (
    <Modal
      dialogClassName="modal-justificativa-com-anexo modal-90w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      {(state.acao === "responder" ||
        state.acao === "questionar_ue" ||
        state.acao === "resposta_ue" ||
        state.acao === "questionar_nutrisupervisor" ||
        state.acao === "resposta_nutrisupervisor") && (
        <Modal.Body>
          <Form
            onSubmit={onSubmit}
            initialValues={state.produto}
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
                  {["resposta_ue", "resposta_nutrisupervisor"].includes(
                    state.acao,
                  ) ? (
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Fabricante"
                        name="fabricante.nome"
                        disabled={true}
                      />
                    </div>
                  ) : (
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Tipo"
                        name="tipo_dieta"
                        defaultValue={
                          state.produto.eh_para_alunos_com_dieta
                            ? "D. Especial"
                            : "Comum"
                        }
                        disabled={true}
                      />
                    </div>
                  )}
                  {(state.acao === "questionar_ue" ||
                    state.acao === "questionar_nutrisupervisor") && (
                    <div className="col-12">
                      <Field
                        component={InputText}
                        label="Unidade Educacional"
                        name="escola"
                        disabled={true}
                        defaultValue={escola ? escola.nome : null}
                      />
                    </div>
                  )}
                </div>
              </form>
            )}
          />
        </Modal.Body>
      )}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, form }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              {state.acao === "questionar_terceirizada" && (
                <div className="form-row">
                  <div className="col-12">
                    <Field
                      component={InputText}
                      label="Terceirizada"
                      name="nome_terceirizada"
                      disabled={true}
                      defaultValue={
                        terceirizada ? terceirizada.nome_fantasia : null
                      }
                    />
                  </div>
                </div>
              )}
              <div className="form-row">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label={labelJustificativa}
                    name="justificativa"
                    required
                    validate={(value) => {
                      for (let validator of [peloMenosUmCaractere, required]) {
                        const erro = validator(value);
                        if (erro) return erro;
                      }
                    }}
                  />
                </div>
              </div>
              {comAnexo && (
                <section className="form-row attachments">
                  <div className="col-9">
                    <div className="card-title fw-bold cinza-escuro">
                      Anexar
                    </div>
                    <div className="text">
                      Anexar fotos, documentos ou relatórios relacionados.
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
              )}
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
                  {state.acao === "responder" ? (
                    <>
                      <Botao
                        texto="Finalizar reclamação"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => {
                          state.tipo_resposta = "rejeitar";
                          form.submit();
                        }}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3"
                        disabled={submitting}
                      />
                      <Botao
                        texto="Suspender produto"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={abreModalSuspensao}
                        style={BUTTON_STYLE.RED_OUTLINE}
                        className="ms-3"
                        disabled={submitting}
                      />
                    </>
                  ) : (
                    <Botao
                      texto="Enviar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      disabled={submitting}
                    />
                  )}
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
      <ModalSuspensaoProdutoEdital
        showModal={showModalSuspensao}
        closeModalSuspender={closeModalSuspensao || closeModal}
        onSubmitSupender={onSubmit}
        closeModalJustificativa={closeModal}
        produto={produto}
        uuidReclamacao={uuidReclamacao}
        state={state}
      />
    </Modal>
  );
};

export default ModalJustificativa;
