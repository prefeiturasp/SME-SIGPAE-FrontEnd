import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "../../style.scss";

type ModalRemoverUnidadeEducacionalInterface = {
  showModal: boolean;
  closeModal: () => void;
  handleRemoverUnidade: () => void;
};

export const ModalRemoverUnidadeEducacional = ({
  showModal,
  closeModal,
  handleRemoverUnidade,
}: ModalRemoverUnidadeEducacionalInterface) => {
  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-remocao-recreio">
          Remover Unidade
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Deseja remover esta unidade deste cadastro de Recreio nas Férias?</p>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-end mt-3">
          <Botao
            texto="Não"
            type={BUTTON_TYPE.BUTTON}
            onClick={closeModal}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="ms-3"
          />
          <Botao
            texto="Sim"
            type={BUTTON_TYPE.BUTTON}
            onClick={handleRemoverUnidade}
            style={BUTTON_STYLE.GREEN}
            className="ms-2"
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
