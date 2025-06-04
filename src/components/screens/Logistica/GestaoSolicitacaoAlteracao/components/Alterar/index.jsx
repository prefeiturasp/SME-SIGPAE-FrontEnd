import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Field, Form } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import ConfirmarAlteracao from "./ConfirmarAlteracao";
import "./styles.scss";
import { BOTAO_ACEITAR } from "../../constans";

export default ({ solicitacao, updatePage, acao }) => {
  const [show, setShow] = useState(false);
  const [showConfirmarAlteracao, setShowConfirmarAlteracao] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = async () => {
    setShowConfirmarAlteracao(true);
  };

  const aceiteText = acao === BOTAO_ACEITAR ? "Aceitar" : "Negar";

  return (
    <>
      <Botao
        texto={aceiteText}
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN}
        onClick={handleShow}
        className="float-end ms-3"
      />

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title> {aceiteText} solicitação de alteração </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Solicitação de alteração número:{" "}
          <b>{solicitacao.numero_solicitacao}</b>.<br />
          <br />
          <Form
            onSubmit={onSubmit}
            subscription={{ submitting: true, values: true }}
            validate={(values) => {
              const errors = {};
              if (!values.justificativa) {
                errors.justificativa = "Campo obrigatório";
              }
              return errors;
            }}
            render={({ handleSubmit, form, values }) => {
              return (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="filtros-alterar-req-logistica"
                  >
                    <div className="row mb-5">
                      <div className="col">
                        <Field
                          component={TextArea}
                          label={
                            acao === BOTAO_ACEITAR
                              ? "Justificativa de aceite"
                              : "Justificativa de negação"
                          }
                          name="justificativa"
                          required={true}
                        />
                      </div>
                    </div>
                    <br />

                    <div className="row mb-3">
                      <div className="col">
                        <ConfirmarAlteracao
                          show={showConfirmarAlteracao}
                          setShow={setShowConfirmarAlteracao}
                          form={form}
                          updatePage={updatePage}
                          handleCloseAll={handleClose}
                          solicitacao={solicitacao}
                          values={values}
                          acao={acao}
                        />
                        <Botao
                          texto="Voltar"
                          type={BUTTON_TYPE.BUTTON}
                          onClick={handleClose}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                        />
                      </div>
                    </div>
                  </form>
                </>
              );
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
