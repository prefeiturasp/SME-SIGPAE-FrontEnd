import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { WEEK } from "src/configs/constants";
import { required } from "src/helpers/fieldValidators";
import {
  mensagemCancelamento,
  stringSeparadaPorVirgulas,
} from "src/helpers/utilities";
import React from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import moment from "moment";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";

export const ModalCancelarInclusaoContinua = ({ ...props }) => {
  const {
    closeModal,
    showModal,
    solicitacao,
    endpoint,
    tipoSolicitacao,
    loadSolicitacao,
    uuid,
  } = props;

  const onSubmit = async (values) => {
    if (!values.quantidades_periodo.some((qtd_prd) => qtd_prd.cancelado)) {
      toastError("Selecione pelo menos uma data");
      return;
    }
    const resp = await endpoint(uuid, values, tipoSolicitacao);
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      if (
        values.quantidades_periodo.filter((qtd_prd) => qtd_prd.cancelado)
          .length !== values.quantidades_periodo.length
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
              <p>Selecione a(s) data(s) para solicitar o cancelamento:</p>
              <p>
                Motivo: <strong>{solicitacao.motivo.nome}</strong>
              </p>
              {solicitacao.quantidades_periodo.map(
                (quantidade_periodo, key) => {
                  return [
                    <div key={key} className="row fw-bold">
                      <div className="col-1">De</div>
                      <div className="col-1">Até</div>
                      {solicitacao.motivo.nome !== "ETEC" && (
                        <div className="col-3">Repetir</div>
                      )}
                      <div className="col-2">Período</div>
                      <div className="col-3">Tipos de alimentação</div>
                      <div className="col-1">Nº de alunos</div>
                    </div>,
                    <div key={quantidade_periodo.uuid} className="row">
                      <div className="col-1">
                        <Field
                          component={"input"}
                          type="hidden"
                          name={`quantidades_periodo[${key}].uuid`}
                          defaultValue={quantidade_periodo.uuid}
                        />
                        <Field
                          name={`quantidades_periodo[${key}].cancelado`}
                          component="input"
                          data-testid={`data-cancelamento-continuo-${key}`}
                          disabled={
                            quantidade_periodo.cancelado ||
                            moment(solicitacao.data_inicial, "DD/MM/YYYY") <=
                              moment()
                          }
                          type="checkbox"
                          defaultValue={quantidade_periodo.cancelado}
                        />{" "}
                        {solicitacao.data_inicial}
                      </div>
                      <div className="col-1">{solicitacao.data_final}</div>
                      {solicitacao.motivo.nome !== "ETEC" && (
                        <div className="col-3">
                          <td className="weekly">
                            {WEEK.map((day, key_) => {
                              return (
                                <span
                                  key={key_}
                                  className={
                                    quantidade_periodo.dias_semana
                                      .map(String)
                                      .includes(day.value)
                                      ? "week-circle-clicked green"
                                      : "week-circle"
                                  }
                                  data-cy={`dia-${key}`}
                                  value={day.value}
                                >
                                  {day.label}
                                </span>
                              );
                            })}
                          </td>
                        </div>
                      )}
                      <div className="col-2">
                        {quantidade_periodo.periodo_escolar.nome}
                      </div>
                      <div className="col-3">
                        {stringSeparadaPorVirgulas(
                          quantidade_periodo.tipos_alimentacao,
                          "nome"
                        )}
                      </div>
                      <div className="col-1">
                        {quantidade_periodo.numero_alunos}
                      </div>
                    </div>,
                    <hr key={Math.random()} />,
                  ];
                }
              )}
              <div className="row ps-3 pe-3">
                <Field
                  component={TextArea}
                  dataTestId="textarea-justificativa"
                  label="Justificativa"
                  name="justificativa"
                  required
                  validate={required}
                  height="100"
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
