import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  titulo: string;
  onSubmit: () => void;
};

const ModalSalvar = ({ showModal, setShowModal, titulo, onSubmit }: Props) => {
  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Salvar Parametrização Financeira</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Deseja salvar a parametrização financeira para o edital: <b>{titulo}</b>
        ?
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
          type={BUTTON_TYPE.SUBMIT}
          onClick={() => {
            onSubmit();
            setShowModal(false);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSalvar;
