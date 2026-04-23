import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { PAINEL_GESTAO_PRODUTO } from "src/configs/constants";
import { textAreaRequiredAndAtLeastOneCharacter } from "src/helpers/fieldValidators";
import { getError } from "src/helpers/utilities";
import Botao from "../Botao";
import "./style.scss";

export const ModalPadrao = ({ ...props }) => {
  const {
    cancelaAnaliseSensorial,
    closeModal,
    endpoint,
    eAnalise,
    labelJustificativa,
    loadSolicitacao,
    modalTitle,
    protocoloAnalise,
    showModal,
    status,
    terceirizada,
    terceirizadas,
    textAreaPlaceholder,
    tipoModal,
    toastSuccessMessage,
    uuid,
    ...textAreaProps
  } = props;

  const navigate = useNavigate();
  const painelProdutos = () => navigate(`/${PAINEL_GESTAO_PRODUTO}`);

  const enviarJustificativa = async (formValues) => {
    const { justificativa } = formValues;
    let resp = undefined;
    if (eAnalise) {
      const terceirizada = terceirizadas.find(
        (t) => t.nome_fantasia === formValues.nome_terceirizada,
      );
      resp = await endpoint(uuid, justificativa, terceirizada.uuid);
    } else {
      resp = await endpoint(uuid, justificativa);
    }
    if (resp.status === HTTP_STATUS.OK) {
      closeModal();
      if (loadSolicitacao) {
        loadSolicitacao(uuid);
      } else {
        painelProdutos();
      }
      toastSuccess(toastSuccessMessage);
    } else {
      toastError(getError(resp.data));
    }
  };

  const getTerceirizadasFiltrado = (t) => {
    if (t) {
      const reg = new RegExp(t, "i");
      return terceirizadas
        .map((t) => t.nome_fantasia)
        .filter((a) => reg.test(a));
    }
    return terceirizadas.map((t) => t.nome_fantasia);
  };

  return (
    <Modal
      dialogClassName="modal-50w modal-question"
      show={showModal}
      onHide={closeModal}
    >
      <Form
        onSubmit={enviarJustificativa}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {protocoloAnalise !== null && tipoModal === "analise" && (
                <div className="numero-protocolo">
                  <div>Número Protocolo: {protocoloAnalise}</div>
                </div>
              )}
              {cancelaAnaliseSensorial !== undefined &&
                cancelaAnaliseSensorial && (
                  <div className="row">
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nome do Produto"
                        name="nome_produto"
                        defaultValue={cancelaAnaliseSensorial.produto.nome}
                        disabled={true}
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Marca do Produto"
                        name="marca_produto"
                        defaultValue={
                          cancelaAnaliseSensorial.produto.marca.nome
                        }
                        disabled={true}
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Fabricante do Produto"
                        name="fabricante_produto"
                        defaultValue={
                          cancelaAnaliseSensorial.produto.fabricante.nome
                        }
                        disabled={true}
                      />
                    </div>
                  </div>
                )}

              {eAnalise !== undefined && eAnalise && (
                <div className="row">
                  <div className="col-12">
                    <Field
                      component={AutoCompleteField}
                      dataSource={getTerceirizadasFiltrado(
                        values.nome_terceirizada,
                      )}
                      label="Nome da empresa solicitante (Terceirizada)"
                      placeholder="Digite nome da terceirizada"
                      name="nome_terceirizada"
                      validate={(value) =>
                        !value ? "Campo obrigatório" : undefined
                      }
                      required
                      defaultValue={
                        status === "CODAE_PENDENTE_HOMOLOGACAO"
                          ? terceirizada.nome_fantasia
                          : null
                      }
                      disabled={
                        status === "CODAE_PENDENTE_HOMOLOGACAO" ? true : false
                      }
                    />
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label={labelJustificativa}
                    placeholder={textAreaPlaceholder}
                    name="justificativa"
                    required
                    validate={textAreaRequiredAndAtLeastOneCharacter}
                    {...textAreaProps}
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
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Enviar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
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
