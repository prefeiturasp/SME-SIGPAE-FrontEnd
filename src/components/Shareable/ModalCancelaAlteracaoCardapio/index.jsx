import { required } from "src/helpers/fieldValidators";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { deepCopy, mensagemCancelamento } from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { TIPO_SOLICITACAO } from "src/constants/shared";

export const ModalCancelarAlteracaoCardapio = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    uuid,
    solicitacao,
    endpoint,
    tipoSolicitacao,
    loadSolicitacao,
  } = props;

  const onSubmit = async (values) => {
    if (
      tipoSolicitacao !== TIPO_SOLICITACAO.SOLICITACAO_CEI &&
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
        tipoSolicitacao !== TIPO_SOLICITACAO.SOLICITACAO_CEI &&
        values_.datas.length +
          solicitacao.datas_intervalo.filter((i) => i.cancelado).length !==
          solicitacao.datas_intervalo.length
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
              {tipoSolicitacao !== TIPO_SOLICITACAO.SOLICITACAO_CEI && (
                <>
                  <p>Selecione a(s) data(s) para solicitar o cancelamento:</p>
                  {solicitacao.data_inicial && (
                    <p>
                      Período solicitado: {solicitacao.data_inicial} a{" "}
                      {solicitacao.data_final}
                    </p>
                  )}
                  {solicitacao.datas_intervalo.map((dia, key_) => {
                    return (
                      <label key={key_} className="me-3">
                        <Field
                          name="datas"
                          data-testid={`data_${dia.data}`}
                          component="input"
                          disabled={
                            solicitacao.datas_intervalo.find(
                              (i) => i.data === dia.data
                            ).cancelado ||
                            moment(dia.data, "DD/MM/YYYY") <=
                              moment().subtract("days", 1)
                          }
                          type="checkbox"
                          value={dia.data}
                        />{" "}
                        {dia.data}
                      </label>
                    );
                  })}
                </>
              )}
              <div className="row ps-3 pe-3">
                <span className="required-asterisk-2">
                  <label>Justificativa</label>
                </span>
                <Field
                  data-testid="textarea-justificativa"
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
