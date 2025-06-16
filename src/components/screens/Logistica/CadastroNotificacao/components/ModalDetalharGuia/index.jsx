import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import DetalheGuiaRemessa from "src/components/Logistica/DetalheGuiaRemessa";
import "./style.scss";
import { Spin } from "antd";
import { imprimirGuiaRemessa } from "src/services/logistica.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export default ({ guia, handleClose, botaoAcao }) => {
  const [carregando, setCarregando] = useState(false);

  const baixarPDFGuiaRemessa = () => {
    setCarregando(true);
    let uuid = guia.uuid;
    imprimirGuiaRemessa(uuid)
      .then(() => {
        setCarregando(false);
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  return (
    <Modal
      show={guia ? true : false}
      onHide={handleClose}
      dialogClassName="modal-detalhe-guia-ocorrencia"
    >
      <Spin tip="Carregando..." spinning={carregando}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            Nº da Guia de Remessa: {guia ? guia.numero_guia : ""}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DetalheGuiaRemessa guia={guia} />
        </Modal.Body>
        <Modal.Footer>
          <Botao
            texto="Baixar PDF da Guia"
            type={BUTTON_TYPE.BUTTON}
            onClick={() => baixarPDFGuiaRemessa()}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ms-3"
          />
          {botaoAcao(guia)}
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};
