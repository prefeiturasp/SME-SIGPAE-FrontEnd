import React, { useContext, useState } from "react";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import HTTP_STATUS from "http-status-codes";
import { agregarDefault, getError } from "helpers/utilities";
import { required } from "helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { SolicitacaoAlimentacaoContext } from "context/SolicitacaoAlimentacao";
import Select from "components/Shareable/Select";

export const ModalNaoValidarFinalForm = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    solicitacao,
    endpoint,
    loadSolicitacao,
    motivosDREnaoValida,
    tipoSolicitacao,
  } = props;
  const [desabilitaBotaoSim, setDesabilitaBotaoSim] = useState(true);

  const solicitacaoAlimentacaoContext = useContext(
    SolicitacaoAlimentacaoContext
  );

  const onSubmit = async (values) => {
    const justificativa = {
      justificativa: `${
        motivosDREnaoValida.find(
          (motivo) => motivo.uuid === values.motivo_nao_valida
        ).nome
      } - ${values.justificativa}`,
    };
    const resp = await endpoint(
      solicitacao.uuid,
      justificativa,
      tipoSolicitacao
    );
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      toastSuccess("Solicitação não validada com sucesso!");
      if (loadSolicitacao) {
        const response = await loadSolicitacao(solicitacao.uuid);
        if (response && response.status === HTTP_STATUS.OK) {
          solicitacaoAlimentacaoContext.updateSolicitacaoAlimentacao(
            response.data
          );
        }
      }
    } else {
      toastError(
        `Houve um erro ao não validar a solicitação: ${getError(resp.data)}`
      );
      closeModal();
    }
  };

  const onChangeForm = (values) => {
    if (values.justificativa && values.motivo_nao_valida) {
      setDesabilitaBotaoSim(false);
    } else setDesabilitaBotaoSim(true);
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Deseja não validar solicitação?</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row">
                <div className="form-group col-12">
                  <Field
                    component={Select}
                    dataTestId="select-motivo-cancelamento"
                    name="motivo_nao_valida"
                    label="Motivo"
                    //TODO: criar campos a mais no backend?
                    naoDesabilitarPrimeiraOpcao
                    options={agregarDefault(motivosDREnaoValida)}
                    validate={required}
                    required
                    inputOnChange={() => onChangeForm(form.getState().values)}
                  />
                </div>
                <div className="form-group col-12">
                  <Field
                    component={TextArea}
                    dataTestId="textarea-justificativa"
                    placeholder="Obrigatório"
                    label="Justificativa"
                    name="justificativa"
                    validate={required}
                    required
                    inputOnChange={() => onChangeForm(form.getState().values)}
                  />
                </div>
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
                disabled={desabilitaBotaoSim}
                className="ms-3"
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
