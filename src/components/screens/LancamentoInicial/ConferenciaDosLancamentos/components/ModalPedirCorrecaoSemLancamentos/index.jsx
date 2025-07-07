import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { InputText } from "src/components/Shareable/Input/InputText";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { MESES } from "src/constants/shared";
import {
  composeValidators,
  peloMenosUmCaractere,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import { codaePedeCorrecaoSolicitacaoMedicaoSemLancamentos } from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";

export const ModalPedirCorrecaoSemLancamentos = ({ ...props }) => {
  const { showModal, closeModal, mes, ano, uuid, atualizarDados, setLoading } =
    props;

  const onSubmit = async (values) => {
    const response = await codaePedeCorrecaoSolicitacaoMedicaoSemLancamentos(
      uuid,
      values
    );
    setLoading(true);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(
        "Solicitação de correção enviada para a Unidade com sucesso!"
      );
      atualizarDados();
      closeModal();
    } else {
      toastError(getError(response.data));
    }
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      backdrop="static"
      onHide={() => closeModal()}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Solicitação de Correção de Medição Inicial
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-3 mes-lancamento">
                  <b className="pb-2 mb-2">Mês do Lançamento</b>
                  <Field
                    component={InputText}
                    dataTestId="input-mes-lancamento"
                    name="mes_lancamento"
                    defaultValue={`${MESES[mes - 1]} / ${ano}`}
                    disabled
                  />
                </div>
              </div>
              <Field
                component={CKEditorField}
                label="Descrição da Correção"
                name="justificativa"
                required={!process.env.IS_TEST}
                validate={
                  !process.env.IS_TEST &&
                  composeValidators(textAreaRequired, peloMenosUmCaractere)
                }
              />
            </Modal.Body>
            <Modal.Footer>
              <div className="row">
                <div className="col-12">
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => closeModal()}
                    style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Enviar"
                    dataTestId="botao-enviar-modal"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    disabled={submitting}
                    className="ms-3"
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
