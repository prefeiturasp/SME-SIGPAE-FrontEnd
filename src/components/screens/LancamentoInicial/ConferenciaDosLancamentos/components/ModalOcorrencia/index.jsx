import React from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { peloMenosUmCaractere, required } from "helpers/fieldValidators";
import { Field, Form } from "react-final-form";
import CKEditorField from "components/Shareable/CKEditorField";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  drePedeCorrecaoOcorrencia,
  drePedeAprovacaoOcorrencia,
  codaePedeCorrecaoOcorrencia,
  codaePedeAprovacaoOcorrencia
} from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { usuarioEhDRE } from "helpers/utilities";

export const ModalOcorrencia = ({ ...props }) => {
  const {
    showModal,
    setShowModal,
    ocorrencia,
    atualizarDados,
    titulo,
    descricao,
    temJustificativa,
    ehCorrecao,
    tituloBotoes
  } = props;

  const solicitarCorrecao = async values => {
    const response = usuarioEhDRE()
      ? await drePedeCorrecaoOcorrencia(ocorrencia.uuid, values)
      : await codaePedeCorrecaoOcorrencia(ocorrencia.uuid, values);
    if (response.status === HTTP_STATUS.OK) {
      setShowModal(false);
      toastSuccess(
        `Solicitação de correção no Formulário de Ocorrências salva com sucesso!`
      );
      atualizarDados();
    } else {
      toastError(
        `Houve um erro ao salvar correção no Formulário de Ocorrências!`
      );
    }
    setShowModal(false);
  };

  const aprovarOcorrencia = async () => {
    const response = usuarioEhDRE()
      ? await drePedeAprovacaoOcorrencia(ocorrencia.uuid)
      : await codaePedeAprovacaoOcorrencia(ocorrencia.uuid);
    if (response.status === HTTP_STATUS.OK) {
      setShowModal(false);
      toastSuccess(
        `Solicitação de aprovação no Formulário de Ocorrências salva com sucesso!`
      );
      atualizarDados();
    } else {
      toastError(
        `Houve um erro ao salvar aprovação no Formulário de Ocorrências!`
      );
    }
    setShowModal(false);
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={values =>
          ehCorrecao ? solicitarCorrecao(values) : aprovarOcorrencia()
        }
        initialValues={{}}
        render={({ handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="form-row row-ativacao mt-3">
                <div className="col-12">
                  <p>{descricao}</p>
                </div>
                {temJustificativa && (
                  <div className="col-12">
                    <Field
                      component={CKEditorField}
                      label="Descrição da Correção"
                      name="justificativa"
                      required
                      validate={value => {
                        for (let validator of [
                          peloMenosUmCaractere,
                          required
                        ]) {
                          const erro = validator(value);
                          if (erro) return erro;
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <div className="row mt-4">
                <div className="col-12">
                  <Botao
                    texto={tituloBotoes[0]}
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => setShowModal(false)}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ml-3"
                  />
                  <Botao
                    texto={tituloBotoes[1]}
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ml-3"
                    disabled={
                      ehCorrecao
                        ? submitting ||
                          peloMenosUmCaractere(values.justificativa) !==
                            undefined
                        : false
                    }
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
