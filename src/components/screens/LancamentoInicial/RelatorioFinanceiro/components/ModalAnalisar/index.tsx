import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { editarRelatorioFinanceiro } from "src/services/medicaoInicial/relatorioFinanceiro.service";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  uuidRelatorio: string | undefined;
  onAnalisar: () => void;
  onVisualizar: () => void;
};

const ModalAnalisar = ({
  onAnalisar,
  onVisualizar,
  showModal,
  setShowModal,
  uuidRelatorio,
}: Props) => {
  const handleAnalisar = async () => {
    if (uuidRelatorio) {
      const response = await editarRelatorioFinanceiro(uuidRelatorio, {
        status: "EM_ANALISE",
      });
      if (response.status === 200) {
        setShowModal(false);
        onAnalisar();
      } else
        toastError(
          "Ocorreu um erro ao tentar analisar o relatório financeiro.",
        );
    } else onAnalisar();
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Analisar ou Visualizar Medição</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Ao acessar o relatório financeiro você poderá apenas visualizar os
        lançamentos ou analisar os dados para fechamento com empenhos e
        descontos caso necessário. Como deseja prosseguir?
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Apenas Visualizar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
          onClick={() => onVisualizar()}
        />
        <Botao
          texto="Analisar Ateste Financeiro"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
          onClick={() => handleAnalisar()}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAnalisar;
