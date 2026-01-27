import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import React from "react";
import { Modal } from "react-bootstrap";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import {
  ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "../../../../../configs/constants";
import {
  usuarioEhCronograma,
  usuarioEhCodaeDilog,
  usuarioEhDilogDiretoria,
} from "../../../../../helpers/utilities";
import { ItemCalendario } from "../../interfaces";
import { EtapaCalendario } from "src/interfaces/pre_recebimento.interface";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

interface Props {
  event: ItemCalendario<EtapaCalendario>;
  showModal: boolean;
  closeModal: () => void;
}

export const ModalCronograma: React.FC<Props> = ({
  event,
  showModal,
  closeModal,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      dialogClassName="modal-info-cronograma modal-50w"
      show={showModal}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Informações do Cronograma</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <span className="fw-bold">Nº do Cronograma: </span>
            <span className="fw-bold green">
              {event.objeto.numero_cronograma}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span className="fw-bold">Nome do Produto: </span>
            <span>{event.objeto.nome_produto}</span>
            {event.programa_leve_leite && (
              <TagLeveLeite className="ms-3 absolute" />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span className="fw-bold">Nome do Fornecedor: </span>
            <span>{event.objeto.nome_fornecedor}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <span className="fw-bold">Data da Entrega: </span>
            <span>{event.objeto.data_programada}</span>
          </div>
          <div className="col-6">
            <span className="fw-bold">Empenho: </span>
            <span>{event.objeto.numero_empenho}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <span className="fw-bold">Etapa: </span>
            <span>{event.objeto.etapa}</span>
          </div>
          <div className="col-4">
            <span className="fw-bold">Parte: </span>
            <span>{event.objeto.parte}</span>
          </div>
          <div className="col-4">
            <span className="fw-bold">Quantidade: </span>
            <span>
              {event.objeto.quantidade} {event.objeto.unidade_medida}
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {(usuarioEhCronograma() ||
          usuarioEhDilogDiretoria() ||
          usuarioEhCodaeDilog()) &&
          event.objeto.status === "Assinado CODAE" && (
            <Botao
              texto="Alterar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                navigate(
                  `/${PRE_RECEBIMENTO}/${ALTERACAO_CRONOGRAMA}?uuid=${event.objeto.uuid_cronograma}`,
                );
              }}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
          )}
        <Botao
          texto="Fechar"
          onClick={closeModal}
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          className="ms-3"
        />
      </Modal.Footer>
    </Modal>
  );
};
