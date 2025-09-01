import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Field, Form } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { textAreaRequired } from "src/helpers/fieldValidators";

export default ({ index, handleClose, aprovacoes, setAprovacoes }) => {
  const solicitaAlteracao = async (values) => {
    let newAprovacoes = [...aprovacoes];
    newAprovacoes[index] = {
      aprovado: false,
      justificativa_alteracao: values.justificativa,
    };
    setAprovacoes(newAprovacoes);
    handleClose();
  };

  const justificativaInicial = aprovacoes[index]
    ? aprovacoes[index].justificativa_alteracao
    : "";

  return (
    <Modal
      show={index !== false ? true : false}
      onHide={handleClose}
      dialogClassName="modal-solicita-alteracao-notificacao"
    >
      <Modal.Header closeButton>
        <Modal.Title> Solicitar Alteração </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={solicitaAlteracao}
        subscription={{ submitting: true, values: true }}
        initialValues={{
          justificativa: justificativaInicial,
        }}
        render={({ handleSubmit, form, values }) => {
          return (
            <>
              <Modal.Body>
                <form
                  onSubmit={handleSubmit}
                  className="filtros-alterar-req-logistica"
                >
                  <div className="row mb-5">
                    <div className="col">
                      <Field
                        component={TextArea}
                        label={"Justificativa"}
                        name="justificativa"
                        placeholder="Digite a justificativa"
                        required
                        validate={textAreaRequired}
                      />
                    </div>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Botao
                  texto="Cancelar"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={handleClose}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="float-end ms-3"
                />
                <Botao
                  texto="Salvar"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={form.submit}
                  style={BUTTON_STYLE.GREEN}
                  disabled={!values.justificativa}
                  className="float-end ms-3"
                />
              </Modal.Footer>
            </>
          );
        }}
      />
    </Modal>
  );
};
