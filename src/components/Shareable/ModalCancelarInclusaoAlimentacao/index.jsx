import { TIPO_SOLICITACAO } from "constants/shared";
import { required } from "helpers/fieldValidators";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { deepCopy, mensagemCancelamento } from "../../../helpers/utilities";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";
import { toastError, toastSuccess } from "../Toast/dialogs";
import { formataMotivosDiasComOutros } from "../../InclusaoDeAlimentacao/Relatorio/componentes/helper";

export const ModalCancelarInclusaoAlimentacao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    uuid,
    solicitacao,
    endpoint,
    tipoSolicitacao,
    loadSolicitacao,
  } = props;

  const dias_motivos =
    solicitacao &&
    (solicitacao.inclusoes ||
      solicitacao.dias_motivos_da_inclusao_cemei ||
      solicitacao.dias_motivos_da_inclusao_cei);

  const onSubmit = async (values) => {
    if (
      [
        TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
        TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
      ].includes(tipoSolicitacao) &&
      (!values.datas || values.datas.length === 0)
    ) {
      toastError("Selecione pelo menos uma data");
      return;
    }
    const values_ = deepCopy(values);
    if (values.datas) {
      values_.datas = values_.datas.map((data) =>
        data.split("/").reverse().join("-")
      );
    }
    const resp = await endpoint(uuid, values_, tipoSolicitacao);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      if (
        [
          TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
          TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
        ].includes(tipoSolicitacao) &&
        values_.datas.length +
          dias_motivos.filter((i) => i.cancelado).length !==
          dias_motivos.length
      ) {
        toastSuccess("Solicitação cancelada parcialmente com sucesso");
      } else {
        toastSuccess("Solicitação cancelada com sucesso!");
      }
      if (loadSolicitacao) loadSolicitacao(uuid, tipoSolicitacao);
    } else {
      closeModal();
      toastError(resp.data.detail);
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Cancelamento de Solicitação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <p className="label--red">
                    {solicitacao && mensagemCancelamento(solicitacao.status)}
                    Deseja seguir em frente com o cancelamento?
                  </p>
                </div>
              </div>
              {[
                TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
                TIPO_SOLICITACAO.SOLICITACAO_CEI,
                TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
              ].includes(tipoSolicitacao) && (
                <>
                  <p>Selecione a(s) data(s) para solicitar o cancelamento:</p>
                  {Object.entries(
                    formataMotivosDiasComOutros(dias_motivos)
                  ).map((dadosMotivo, key) => {
                    const [motivo, datas] = dadosMotivo;
                    return (
                      <div key={key}>
                        <p>
                          Motivo: <strong>{motivo}</strong>
                        </p>
                        {datas.map((dia, key_) => {
                          return (
                            <label key={key_} className="me-3">
                              <Field
                                name="datas"
                                data-testid={`data_${motivo}_${dia}`}
                                component="input"
                                disabled={
                                  dias_motivos.find((i) => i.data === dia)
                                    .cancelado ||
                                  moment(dia, "DD/MM/YYYY") <= moment()
                                }
                                type="checkbox"
                                value={dia}
                              />{" "}
                              {dia}
                            </label>
                          );
                        })}
                        <hr />
                      </div>
                    );
                  })}
                </>
              )}
              {solicitacao.inclusoes &&
                solicitacao.inclusoes[0].motivo.nome === "ETEC" && (
                  <>
                    <p>
                      Selecione a(s) data(s) para solicitar o cancelamento:
                      <span className="ms-2">
                        {solicitacao.data_inicial} até {solicitacao.data_final}
                      </span>
                    </p>
                    <p>
                      Motivo:{" "}
                      <strong>{solicitacao.inclusoes[0].motivo.nome}</strong>
                    </p>
                  </>
                )}
              <div className="row ps-3 pe-3">
                <span className="required-asterisk-2">
                  <label>Justificativa</label>
                </span>
                <Field
                  className="col-12 pb-5"
                  component="textarea"
                  name="justificativa"
                  validate={required}
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Não"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="ms-3"
              />
              <Botao
                texto="Sim"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
