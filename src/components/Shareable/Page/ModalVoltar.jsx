import React from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Botao } from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";

const ModalVoltar = ({
  modalVoltar,
  voltarPara,
  setModalVoltar,
  textoModalVoltar,
}) => {
  const navigate = useNavigate();

  const voltarPagina = () =>
    window.history.length > 1 ? navigate(-1) : navigate(voltarPara);

  return (
    <Modal
      className="modal-botao-voltar"
      show={modalVoltar}
      onHide={() => {
        setModalVoltar(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <b>Voltar a tela anterior</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Deseja voltar para a tela anterior?</p>

        {textoModalVoltar ? (
          <p> {textoModalVoltar} </p>
        ) : (
          <p>
            Verifique se todas as informações importantes já foram salvas antes
            de sair.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Voltar à Tela Anterior"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            voltarPagina();
            window.scrollTo(0, 0);
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Permanecer"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => setModalVoltar(false)}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalVoltar;
