import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  uuidParametrizacao: string | null;
  onCancelar: () => void;
};

const ModalCancelar = ({ showModal, setShowModal, onCancelar }: Props) => {
  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar Aplicação de descontos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="mt-2">
          Deseja cancelar a aplicação de desconto nas Unidades? Ao cancelar
          todas as informações serão perdidas
        </label>
      </Modal.Body>
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
          onClick={() => onCancelar()}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancelar;
