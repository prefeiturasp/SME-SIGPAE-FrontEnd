import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
};

const ModalCancelar = ({ showModal, setShowModal }: Props) => {
  const navigate = useNavigate();

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Parametrização Financeira</Modal.Title>
      </Modal.Header>
      <Modal.Body>Deseja cancelar o cadastro dessa parametrização?</Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            setShowModal(false);
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            navigate(-1);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancelar;
