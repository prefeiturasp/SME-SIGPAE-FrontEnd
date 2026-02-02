import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import {
  required,
  length,
  numericInteger,
  composeValidators,
} from "src/helpers/fieldValidators";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import InputFile from "src/components/Shareable/Input/InputFile";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { useNavigate } from "react-router-dom";
import { InputComData } from "src/components/Shareable/DatePicker";

import "./styles.scss";
import { formataData, DATA_MINIMA, DATA_MAXIMA } from "./helper";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";
import { deepCopy, getError } from "src/helpers/utilities";
import { respostaAnaliseSensorial } from "src/services/produto.service";
import { Field, Form } from "react-final-form";
import { ATimePicker } from "src/components/Shareable/MakeField";

export const ModalResponderAnaliseSensorial = ({ ...props }) => {
  const [arquivos, SetArquivos] = useState([]);

  const { homologacao, closeModal, onSend, showModal } = props;

  const navigate = useNavigate();

  const removeFile = (index) => {
    const arquivos_ = [...arquivos];
    arquivos_.splice(index, 1);
    SetArquivos(arquivos_);
  };

  const resetForm = (form) => {
    form.reset();
    SetArquivos([]);
    onSend();
    closeModal();
  };

  const onSubmit = async (values, form) => {
    const values_ = deepCopy(values);

    if (arquivos.length <= 0) {
      toastError(`Obrigatório anexar documento.`);
    } else {
      values_["hora"] = new Date(values_.hora_min).toTimeString().split(" ")[0];
      values_["data"] = formataData(values_.data_resp);

      values_["anexos"] = arquivos.map((anexo) => {
        return {
          nome: anexo.nome,
          base64: anexo.arquivo,
        };
      });
      values_["homologacao_de_produto"] = homologacao.uuid;

      delete values_["hora_min"];
      delete values_["data_resp"];

      const response = await respostaAnaliseSensorial(values_);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Resposta para análise sensorial enviada com sucesso.");
        navigate("/pesquisa-desenvolvimento/busca-produto-analise-sensorial");
        resetForm(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  return (
    <Modal dialogClassName="modal-90w" show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Responder análise sensorial</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <section>
                <article>
                  <label>
                    Pessoa que recebeu produto{" "}
                    <span className="obrigatorio">*</span>
                  </label>
                  <Field
                    component={InputText}
                    name="responsavel_produto"
                    validate={required}
                  />
                </article>
              </section>

              <section className="tres-colunas-modal">
                <article>
                  <label>
                    RF: <span className="obrigatorio">*</span>
                  </label>
                  <Field
                    component={InputText}
                    name="registro_funcional"
                    validate={composeValidators(
                      required,
                      length(7),
                      numericInteger,
                    )}
                    maxlength="10"
                  />
                </article>

                <article>
                  <label>
                    Data <span className="obrigatorio">*</span>
                  </label>
                  <Field
                    component={InputComData}
                    name="data_resp"
                    validate={required}
                    minDate={DATA_MINIMA}
                    maxDate={DATA_MAXIMA}
                  />
                </article>

                <article>
                  <label>
                    Hora <span className="obrigatorio">*</span>
                  </label>
                  <Field
                    component={ATimePicker}
                    form={form}
                    className="campo-hora"
                    name="hora_min"
                    validate={required}
                    placeholder=""
                    allowClear={false}
                  />
                </article>
              </section>

              <hr />

              <section>
                <article>
                  <label>Observação</label>
                  <Field component={TextArea} name="observacao" required />
                </article>
              </section>

              <div className="row pt-3 pb-3">
                <article className="col-6 produto">
                  <label>
                    <span className="obrigatorio">* </span>Anexar
                  </label>
                  <label className="explicacao pt-2">
                    Anexar documento de entrega ou laudo relacionado ao produto
                  </label>
                </article>
                <div className="col-6 btn">
                  <Field
                    component={InputFile}
                    className="inputfile"
                    texto="Anexar"
                    name="files"
                    accept=".png, .doc, .pdf, .docx, .jpeg, .jpg"
                    setFiles={SetArquivos}
                    removeFile={removeFile}
                    toastSuccess={"Anexo do documento incluído com sucesso!"}
                    multiple
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <section className="rodape-botoes">
                <Botao
                  texto="Voltar"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  onClick={() => {
                    resetForm(form);
                  }}
                />
                <Botao
                  texto="Enviar"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                />
              </section>
            </Modal.Footer>
          </form>
        )}
      </Form>
    </Modal>
  );
};
