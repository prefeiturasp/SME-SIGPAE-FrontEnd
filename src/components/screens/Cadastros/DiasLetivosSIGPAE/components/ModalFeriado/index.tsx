import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";

interface ModalFeriadoProps {
  event: any;
  showModal: boolean;
  closeModal: () => void;
}

const dataPorExtenso = (date: Date) => {
  const formatado = moment(date).format("dddd, DD [de] MMMM [de] YYYY");
  return formatado.charAt(0).toUpperCase() + formatado.slice(1);
};

export const ModalFeriado: React.FC<ModalFeriadoProps> = ({
  event,
  showModal,
  closeModal,
}) => {
  if (!event) return null;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Feriado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Dia: </strong>
          <span className="fw-bold green">{dataPorExtenso(event.start)}</span>
        </p>
        <p>
          <strong>{event.feriado}</strong>
        </p>
      </Modal.Body>
    </Modal>
  );
};
