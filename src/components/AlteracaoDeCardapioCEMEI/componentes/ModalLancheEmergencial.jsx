import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

export const ModalLancheEmergencial = ({
  closeModal,
  showModal,
  resetForm,
}) => {
  const fecharModal = () => {
    resetForm();
    closeModal();
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} backdrop={"static"}>
      <Modal.Header>
        <Modal.Title>Lanche Emergencial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="fw-bold">
          O lanche emergencial somente é previsto para os alunos da EMEI da
          CEMEI.
        </label>
        <br />
        <label className="fw-bold">
          Para realizar a solicitação selecione a opção de alunos EMEI.
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="OK"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => fecharModal()}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="float-end"
        />
      </Modal.Footer>
    </Modal>
  );
};
