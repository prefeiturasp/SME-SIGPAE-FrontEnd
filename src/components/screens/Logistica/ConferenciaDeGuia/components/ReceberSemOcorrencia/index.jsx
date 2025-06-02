import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import { CONFERIR_ENTREGA, LOGISTICA } from "src/configs/constants";
import {
  recebeGuiaSemOcorrencia,
  editaGuiaComOcorrencia,
} from "src/services/logistica.service";
import { Spin } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

export default ({ values, disabled, uuidEdicao }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSim = () => {
    setLoading(true);
    const payload = { ...values };
    delete payload.data_entrega;
    delete payload.numero_guia;
    delete payload.data_entrega_real;

    if (uuidEdicao) {
      payload.uuid_conferencia = uuidEdicao;
      payload.conferencia_dos_alimentos = [];
      editaGuiaComOcorrencia(payload)
        .then(() => {
          let toastMsg =
            "Conferência editada com sucesso. O respectivo registro de reposição foi apagado.";
          toastSuccess(toastMsg);
          setLoading(false);
          goToConferir();
        })
        .catch((e) => {
          toastError(e.response.data.detail);
          setLoading(false);
        });
    } else {
      recebeGuiaSemOcorrencia(payload)
        .then(() => {
          toastSuccess("Guia de remessa recebida com sucesso");
          setShow(false);
          setLoading(false);
          goToConferir();
        })
        .catch(() => {
          toastError(
            "Erro ao registrar Guia de Remessa, procure o administrador do SIGPAE na sua Unidade!"
          );
          setShow(false);
          setLoading(false);
        });
    }
  };

  const goToConferir = () => {
    navigate(`/${LOGISTICA}/${CONFERIR_ENTREGA}`);
  };

  return (
    <>
      <Botao
        texto="Salvar e Continuar"
        type={BUTTON_TYPE.SUBMIT}
        style={BUTTON_STYLE.GREEN}
        icon={BUTTON_ICON.ARROW_RIGHT}
        iconPosition="right"
        className="float-end ms-3"
        onClick={handleShow}
        disabled={disabled}
      />

      <Modal show={show} onHide={handleClose}>
        <Spin tip="Carregando..." spinning={loading}>
          <Modal.Header closeButton>
            <Modal.Title>Registro de conferência</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Você está finalizando o registro de conferência da Guia{" "}
              {values.numero_guia}
              <br />
              Estes apontamentos não poderão ser editados ou alterados.
            </p>

            <p>Deseja prosseguir com o registro?</p>

            <strong>
              <i>
                Data de conferência: {moment(new Date()).format("DD/MM/YYYY")}
              </i>
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              onClick={handleClose}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
            <Botao
              texto={
                uuidEdicao ? "Editar Conferência" : "Registrar Conferência"
              }
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              onClick={handleSim}
            />
          </Modal.Footer>
        </Spin>
      </Modal>
    </>
  );
};
