import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";

interface ModalDadosObjetoProps {
  event: any;
  showModal: boolean;
  closeModal: () => void;
  nomeObjetoNoCalendario?: string;
  nomeObjetoNoCalendarioMinusculo?: string;
  objetos?: any[];
  getObjetosAsync?: (..._args: any[]) => Promise<void>;
  setObjetoAsync?: (..._args: any[]) => Promise<any>;
}

const dataPorExtenso = (date: Date) => {
  const formatado = moment(date).format("dddd, DD [de] MMMM [de] YYYY");
  return formatado.charAt(0).toUpperCase() + formatado.slice(1);
};

const formatarUnidades = (unidades: any) => {
  if (unidades === null || unidades === undefined) return null;
  if (Array.isArray(unidades)) {
    if (unidades.length === 0) return "0";
    if (unidades.every((u) => typeof u === "object" && u !== null)) {
      return `${unidades.length}`;
    }
    return `${unidades.length}`;
  }
  return String(unidades);
};

export const ModalDadosObjeto: React.FC<ModalDadosObjetoProps> = ({
  event,
  showModal,
  closeModal,
}) => {
  if (!event) return null;

  const unidades = formatarUnidades(event.unidades_escolares);

  return (
    <Modal
      dialogClassName="modal-dados-objeto-dia-letivo"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Informações de Dia Letivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Dia Letivo: </strong>
          <span className="fw-bold green">{dataPorExtenso(event.start)}</span>
        </p>
        <p>
          <strong>Editais:</strong> {event.editais_numeros_virgula}
        </p>
        <p>
          <strong>Tipos de Unidades:</strong> {event.tipos_unidade_escolar}
        </p>
        <p>
          <strong>DREs:</strong> {event.lotes}
        </p>
        {unidades !== null && (
          <p>
            <strong>Unidades:</strong> {unidades}
          </p>
        )}
        <p>
          <strong>Períodos Escolares:</strong> {event.periodos_escolares}
        </p>
        <hr />
      </Modal.Body>
      <div className="footer">
        <Botao
          texto="Editar"
          type={BUTTON_TYPE.BUTTON}
          disabled
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className="ms-3 btn-footer-modal"
        />
        <Botao
          texto="Manter"
          onClick={closeModal}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3 btn-footer-modal"
        />
      </div>
    </Modal>
  );
};
