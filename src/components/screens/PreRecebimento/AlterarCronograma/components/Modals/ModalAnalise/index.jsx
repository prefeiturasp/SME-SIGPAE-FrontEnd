import React from "react";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import { TextArea } from "components/Shareable/TextArea/TextArea";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import { useState } from "react";
import { OnChange } from "react-final-form-listeners";
export default ({ show, setShow, handleClose, loading, handleSim }) => {
  const [confirmar, setConfirmar] = useState(false);
  const [podeEnviar, setPodeEnviar] = useState(false);
  return (
    <Form
      onSubmit={async (values) => {
        handleSim(values);
      }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Modal show={show} onHide={handleClose} backdrop={"static"}>
            <Spin tip="Carregando..." spinning={loading}>
              <Modal.Header closeButton>
                <Modal.Title> Análise da alteração </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  component={TextArea}
                  label="Insira sua análise da Solicitação de Alteração"
                  name="justificativa_cronograma"
                  defaultValue=""
                  required
                />

                <OnChange name="justificativa_cronograma">
                  {(value) => {
                    if (value.length > 0) {
                      setPodeEnviar(true);
                    } else {
                      setPodeEnviar(false);
                    }
                  }}
                </OnChange>
              </Modal.Body>
              <Modal.Footer>
                <Botao
                  texto="Voltar"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => {
                    handleClose();
                    setPodeEnviar(false);
                  }}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="ml-3"
                />
                <Botao
                  texto="Enviar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ml-3"
                  disabled={!podeEnviar}
                  onClick={() => {
                    setConfirmar(true);
                    setShow(false);
                  }}
                />
              </Modal.Footer>
            </Spin>
          </Modal>

          <Modal
            show={confirmar}
            onHide={() => setConfirmar(false)}
            backdrop={"static"}
            className="mt-5"
          >
            <Spin tip="Carregando..." spinning={loading}>
              <Modal.Header closeButton>
                <Modal.Title> Confirmar envio para DINUTRE </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Deseja enviar a Análise da Solicitação de Alteração de
                  Cronograma para a <strong>DINUTRE</strong>?{" "}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Botao
                  texto="Não"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={() => {
                    setConfirmar(false);
                    setPodeEnviar(false);
                  }}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  className="ml-3"
                />
                <Botao
                  texto="Sim"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ml-3"
                  onClick={handleSubmit}
                />
              </Modal.Footer>
            </Spin>
          </Modal>
        </form>
      )}
    />
  );
};
