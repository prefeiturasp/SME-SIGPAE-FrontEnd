import React from "react";
import { Modal } from "react-bootstrap";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { formataMesNome } from "src/helpers/utilities";

type ModalSalvarRascunhoType = {
  show: boolean;
  handleClose: () => void;
  mes: string;
  ano: string;
  handleFinalizarMedicao: () => void;
};

export const ModalSemOcorrenciasIMR = ({
  ...props
}: ModalSalvarRascunhoType) => {
  const { show, handleClose, mes, ano, handleFinalizarMedicao } = props;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-cancelar-analise-layout"
    >
      <Modal.Header closeButton>
        <Modal.Title>Finalizar Lançamentos da Medição Inicial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>
          Você confirma a prestação de serviços da empresa sem ocorrências no
          mês de {formataMesNome(mes)}/{ano}?
        </b>
        <p>
          Após a finalização da medição os dados serão enviados para análise de
          DRE e CODAE.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Botao
          texto="Não"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => {
            handleClose();
          }}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3"
        />
        <Botao
          texto="Sim"
          type={BUTTON_TYPE.BUTTON}
          onClick={async () => {
            handleClose();
            handleFinalizarMedicao();
          }}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
