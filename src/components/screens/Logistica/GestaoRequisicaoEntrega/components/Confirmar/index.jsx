import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Button } from "react-bootstrap";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { distribuidorConfirma } from "src/services/logistica.service";
import { Spin } from "antd";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export default ({ solicitacao, updatePage }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSim = () => {
    setLoading(true);
    distribuidorConfirma(solicitacao.uuid)
      .then((response) => {
        if (response.status === 200) {
          updatePage();
          setShow(false);
          setLoading(false);
          toastSuccess("A Confirmação foi realizada com sucesso!");
        }
      })
      .catch(() => {
        updatePage();
        setShow(false);
        setLoading(false);
        toastError("Erro: não foi possível confirmar a requisição.");
      });
  };

  return (
    <>
      <Button
        className="acoes confirmar"
        onClick={handleShow}
        variant="link"
        disabled={solicitacao.status !== "Enviada"}
      >
        <i className="fas fa-check-circle confirmar" /> Confirmar
      </Button>

      <Modal show={show} onHide={handleClose} backdrop={"static"}>
        <Spin tip="Carregando..." spinning={loading}>
          <Modal.Header closeButton>
            <Modal.Title> Confirmar </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Você está confirmando que realizará a entrega conforme <br />{" "}
            Requisição <b>nº {solicitacao.numero_solicitacao}</b>.
          </Modal.Body>
          <Modal.Footer>
            <Botao
              texto="Não"
              type={BUTTON_TYPE.BUTTON}
              onClick={handleClose}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
            <Botao
              texto="Sim"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              onClick={handleSim}
            />
          </Modal.Footer>
        </Spin>
      </Modal>
    </>
  );
};
