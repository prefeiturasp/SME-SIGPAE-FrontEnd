import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import Botao from "../../../Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Botao/constants";
import { ItemCalendarioInterrupcao } from "../../interfaces";
import { deletaInterrupcaoProgramada } from "../../../../../services/cronograma.service";
import { toastError, toastSuccess } from "../../../Toast/dialogs";
import { usuarioEhCronogramaOuCodae } from "../../../../../helpers/utilities";

import "./style.scss";

interface Props {
  evento: ItemCalendarioInterrupcao;
  showModal: boolean;
  closeModal: () => void;
  onDelete: () => void;
}

export const ModalDetalheInterrupcao: React.FC<Props> = ({
  evento,
  showModal,
  closeModal,
  onDelete,
}) => {
  const [excluindo, setExcluindo] = useState(false);

  const formatarData = (data: Date): string => {
    return format(data, "dd/MM/yyyy", { locale: ptBR });
  };

  const handleExcluir = async () => {
    setExcluindo(true);
    try {
      await deletaInterrupcaoProgramada(evento.uuid);
      toastSuccess("Interrupção excluída com sucesso!");
      onDelete();
      closeModal();
    } catch {
      toastError("Erro ao excluir interrupção");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      centered
      className="modal-detalhe-interrupcao"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Interrupção de Entrega
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="info-row">
          <span className="label">Data: </span>
          <span className="value date">{formatarData(evento.start)}</span>
        </div>
        <div className="info-row mt-2">
          <span className="label">Motivo da Interrupção: </span>
          <span className="value">
            {evento.motivo_display}
            {evento.descricao_motivo ? ` - ${evento.descricao_motivo}` : ""}
          </span>
        </div>
        <div className="info-row mt-2">
          <span className="label">Tipo de Calendário: </span>
          <span className="value">{evento.tipo_calendario_display}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {usuarioEhCronogramaOuCodae() && (
          <Botao
            texto="Excluir"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={handleExcluir}
            disabled={excluindo}
          />
        )}
        <Botao
          texto="Fechar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          onClick={closeModal}
          disabled={excluindo}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalheInterrupcao;
