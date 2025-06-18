import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { MESES } from "src/constants/shared";
import {
  composeValidators,
  maxLength,
  required,
} from "src/helpers/fieldValidators";

export const ModalFinalizarMedicaoSemLancamentos = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    handleFinalizarMedicao,
    mes,
    ano,
    setJustificativaSemLancamentos,
  } = props;

  const onSubmit = async () => {
    await handleFinalizarMedicao();
    closeModal();
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      backdrop="static"
      onHide={() => closeModal()}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Finalizar Medição Inicial sem Lançamentos
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
                component={TextArea}
                className="col-12 pb-5"
                label="Justificativa do envio da medição sem lançamentos"
                name="justificativa"
                inputOnChange={(e) =>
                  setJustificativaSemLancamentos(e.target.value)
                }
                required
                validate={composeValidators(required, maxLength(1000))}
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
                    texto="Finalizar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
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
