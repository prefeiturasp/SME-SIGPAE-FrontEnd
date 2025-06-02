import React from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Field, Form } from "react-final-form";
import { getError } from "src/helpers/utilities";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import ManagedInputFileField from "src/components/Shareable/Input/InputFile/ManagedField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { escolaInativaDietaEspecial } from "src/services/dietaEspecial.service";
import {
  peloMenosUmCaractere,
  required,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import { composeValidators } from "src/helpers/utilities";
import "./styles.scss";

export default ({ dieta, showModal, setShowModal, filtros, setFiltros }) => {
  const onSubmit = (values) => {
    escolaInativaDietaEspecial(dieta.uuid, values).then((response) => {
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Solicitação de cancelamento realizada com sucesso.");
        setShowModal(false);
        setFiltros({ ...filtros });
      } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(getError(response.data));
      } else {
        toastError(
          `Erro ao solicitar dieta especial: ${getError(response.data)}`
        );
      }
    });
  };

  return (
    <Modal
      dialogClassName="modal-reclamacao-produto modal-80w"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Deseja solicitar cancelamento de Dieta Especial?
        </Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <section className="row attachments">
                <div className="col-9">
                  <div className="card-title fw-bold cinza-escuro mt-4">
                    <span className="required-asterisk">*</span>Laudo
                  </div>
                  <div className="text">
                    Anexe o laudo de alta fornecido pelo profissional. Sem ele,
                    a solicitação de cancelamento será negada.
                  </div>
                  <div className="card-warning mt-2">
                    <strong>IMPORTANTE:</strong> Envie um arquivo formato .doc,
                    .docx, .pdf, .png, .jpg ou .jpeg, com até 10Mb. <br /> O
                    Laudo deve ter sido emitido há, no máximo, 12 meses.
                  </div>
                </div>
                <div className="col-3 btn">
                  <Field
                    component={ManagedInputFileField}
                    className="inputfile"
                    texto="Anexar"
                    name="anexos"
                    accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                    icone={BUTTON_ICON.ATTACH}
                    toastSuccessMessage="Anexo incluso com sucesso"
                    concatenarNovosArquivos
                    validate={required}
                  />
                </div>
              </section>
              <section className="row mt-5">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label="Justificativa"
                    name="justificativa"
                    className="form-control mb-3"
                    required
                    validate={composeValidators(
                      textAreaRequired,
                      peloMenosUmCaractere
                    )}
                  />
                </div>
              </section>
            </Modal.Body>
            <br /> <br />
            <Modal.Footer>
              <div className="row">
                <div className="col-12 mt-3">
                  <Botao
                    key={0}
                    texto="Sim"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                  />
                  <Botao
                    key={1}
                    type={BUTTON_TYPE.BUTTON}
                    texto="Não"
                    className="ms-2"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => setShowModal(false)}
                  />
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
