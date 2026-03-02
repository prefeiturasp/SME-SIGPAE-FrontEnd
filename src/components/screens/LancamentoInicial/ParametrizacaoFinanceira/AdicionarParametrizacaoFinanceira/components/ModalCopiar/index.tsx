import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  uuidParametrizacao?: string | null;
  onCopiar?: () => void;
};

const ModalCopiar = ({
  showModal,
  setShowModal,
  onCopiar = () => {},
}: Props) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Copiar Parametrização Financeira</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Ao criar uma cópia dessa parametrização, os valores das alimentações
        serão preenchidos automaticamente e podem ser editados.
        <label className="mt-2 fw-bold">
          Deseja prosseguir e criar uma cópia dessa parametrização?
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => setShowModal(false)}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          dataTestId="botao-confirmar-copia"
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            onCopiar();
            setShowModal(false);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCopiar;
