import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  uuidParametrizacao: string | null;
  onCancelar: () => void;
};

const ModalCancelar = ({
  showModal,
  setShowModal,
  uuidParametrizacao,
  onCancelar,
}: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conflitoUuid = searchParams.get("nova_uuid");
  const fluxo = searchParams.get("fluxo");

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
      <Modal.Body>
        Deseja cancelar {!uuidParametrizacao ? "o cadastro" : "a edição"} dessa
        parametrização?
        {fluxo && (
          <label className="mt-2">
            Ao cancelar não haverá nenhuma parametrização ativa, será necessário
            cadastrar novos valores.
          </label>
        )}
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
          onClick={() => {
            if (conflitoUuid) onCancelar();
            navigate(`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`);
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCancelar;
