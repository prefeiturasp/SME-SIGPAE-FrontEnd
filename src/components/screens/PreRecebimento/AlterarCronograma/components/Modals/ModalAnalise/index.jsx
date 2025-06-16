import React from "react";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import { useState } from "react";
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
                  inputOnChange={(e) => {
                    const value = e.target.value;

                    if (value.length > 0) {
                      setPodeEnviar(true);
                    } else {
                      setPodeEnviar(false);
                    }
                  }}
                />
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
                  className="ms-3"
                />
                <Botao
                  texto="Enviar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
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
                <Modal.Title> Confirmar envio para Abastecimento </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Deseja enviar a Análise da Solicitação de Alteração de
                  Cronograma para a <strong>Abastecimento</strong>?{" "}
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
                  className="ms-3"
                />
                <Botao
                  texto="Sim"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  className="ms-3"
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
