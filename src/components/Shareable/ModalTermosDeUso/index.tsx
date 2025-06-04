import React, { ChangeEventHandler, useState } from "react";
import { Modal } from "react-bootstrap";

import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";

import { aceitarTermos } from "src/services/perfil.service";

import "./style.scss";

interface Props {
  nomeUsuario: string;
  uuidUsuario: string;
}

export default ({ nomeUsuario, uuidUsuario }: Props) => {
  const [showModal, setShowModal] = useState(true);
  const [deAcordo, setDeAcordo] = useState(false);

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setDeAcordo(event.target.checked);

  const handleClickContinar = async () => {
    const response = await aceitarTermos(uuidUsuario);
    response.status === 200 && setShowModal(false);
  };

  return (
    <Modal
      dialogClassName="modal-termos-de-uso"
      show={showModal}
      backdrop="static"
      className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
    >
      <Modal.Header>
        <Modal.Title>
          Olá, <strong>{nomeUsuario}</strong>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row py-2">
          <div className="col">
            Atualizamos os{" "}
            <a
              href="assets/documents/termos-de-uso-sigpae.pdf"
              target="_blank"
              // rel="noopener noreferrer"
            >
              Termos de Uso e a Política de Privacidade do SIGPAE
            </a>
            , recomendamos a leitura do documento para seguir com seu acesso ao
            sistema.
          </div>
        </div>

        <div className="row py-2 justify-content-center">
          <div className="col px-3">
            <label className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={deAcordo}
                onChange={handleCheckboxChange}
                className="me-2"
              />
              Declaro que li e estou de acordo com os Termos de Uso e com a
              Política de Privacidade SIGPAE
            </label>
          </div>
        </div>

        <div className="row pt-3 pb-2">
          <div className="col">
            <Botao
              texto="Continuar"
              onClick={handleClickContinar}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end"
              disabled={!deAcordo}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
