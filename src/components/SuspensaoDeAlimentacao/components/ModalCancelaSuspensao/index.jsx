import React from "react";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { required } from "helpers/fieldValidators";
import { deepCopy, getError, mensagemCancelamento } from "helpers/utilities";
import { escolaCancelaSuspensao } from "services/suspensaoDeAlimentacao.service";
import { formataMotivosDiasComOutros } from "../../../InclusaoDeAlimentacao/Relatorio/componentes/helper";

export const ModalCancelaSuspensao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    uuid,
    solicitacao,
    tipoSolicitacao,
    loadSolicitacao,
  } = props;

  const dias_motivos = solicitacao && solicitacao.suspensoes_alimentacao;

  const onSubmit = async (values) => {
    if (!values.datas || values.datas.length === 0) {
      toastError("Selecione pelo menos uma data");
      return;
    }
    const values_ = deepCopy(values);
    if (values.datas) {
      values_.datas = values_.datas.map((data) =>
        data.split("/").reverse().join("-")
      );
    }
    const resp = await escolaCancelaSuspensao(uuid, values_);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      if (
        values_.datas.length +
          dias_motivos.filter((i) => i.cancelado).length !==
        dias_motivos.length
      ) {
        toastSuccess(
          "A solicitação de Suspensão de Alimentação foi cancelada parcialmente com sucesso!"
        );
      } else {
        toastSuccess(
          "A solicitação de Suspensão de Alimentação foi cancelada com sucesso!"
        );
      }
      if (loadSolicitacao) loadSolicitacao(uuid, tipoSolicitacao);
    } else {
      closeModal();
      toastError(getError(resp.data));
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Cancelamento de Suspensão de Alimentação
              </Modal.Title>
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
              {
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
              }
              <div className="row ps-3 pe-3">
                <label>* Justificativa</label>
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
