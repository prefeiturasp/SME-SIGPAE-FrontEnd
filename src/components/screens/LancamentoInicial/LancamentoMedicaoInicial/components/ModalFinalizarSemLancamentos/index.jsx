import { Modal } from "react-bootstrap";
import { Field } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";

export const ModalFinalizarMedicaoSemLancamentos = ({ ...props }) => {
  const { showModal, closeModal } = props;

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      backdrop="static"
      onHide={() => closeModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Finalizar Medição Inicial sem Lançamentos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-3 mes-lancamento">
            <b className="pb-2 mb-2">Mês do Lançamento</b>
            <Field
              component={InputText}
              dataTestId="input-mes-lancamento"
              name="mes_lancamento"
              disabled={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label>* Justificativa do envio da medição sem lançamentos</label>
            <Field
              className="col-12 pb-5"
              component="textarea"
              name="justificativa"
              validate={required}
              required
            />
          </div>
        </div>
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
              texto="Finalizar Medição"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                closeModal();
              }}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
