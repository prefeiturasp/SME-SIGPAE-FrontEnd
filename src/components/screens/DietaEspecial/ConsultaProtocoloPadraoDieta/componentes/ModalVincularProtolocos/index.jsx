import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import { Form, Field } from "react-final-form";
import CKEditorField from "src/components/Shareable/CKEditorField";
import Select from "src/components/Shareable/Select";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  getNomesProtocolosValidosPorEdital,
  vincularProtocolosEditais,
} from "src/services/dietaEspecial.service";
import HTTP_STATUS from "http-status-codes";
import { required, requiredMultiselectKhan } from "src/helpers/fieldValidators";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";

export const ModalVincularProtocolos = ({
  closeModal,
  showModal,
  editais,
  editaisDestino,
  buscar,
}) => {
  const [protocolosPadrao, setProtocolosPadrao] = useState([]);

  const getProtocolosPadraoPorEditalAsync = async (uuid) => {
    try {
      const response = await getNomesProtocolosValidosPorEdital({
        edital_uuid: uuid,
      });
      if (response.status === HTTP_STATUS.OK) {
        setProtocolosPadrao(response.data.results);
      }
    } catch {
      toastError("Houve um erro ao tentar filtrar os Protocolos");
    }
  };

  const vincularProtocolosAsync = async (values) => {
    try {
      const response = await vincularProtocolosEditais(values);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Protocolos Padrão vinculados com sucesso!");
        buscar();
        closeModal(false);
      }
    } catch {
      toastError("Houve um erro ao tentar vincular os Protocolos Padrão");
    }
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} backdrop={"static"}>
      <Modal.Header>
        <Modal.Title>
          <h5 className="fw-bold text-dark">
            Selecionar protocolos padrão aos editais
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={(values) => vincularProtocolosAsync(values)}
        initialValues={{
          edital_origem: undefined,
          protocolos_padrao: undefined,
          editais_destino: undefined,
          outras_informacoes: undefined,
        }}
        render={({ submitting, handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-12">
                  <Field
                    component={Select}
                    name="edital_origem"
                    label="Edital de Origem"
                    options={
                      editais &&
                      [{ uuid: "", nome: "Selecione um edital" }].concat(
                        editais.map((edital) => ({
                          nome: edital.numero,
                          uuid: edital.uuid,
                        })),
                      )
                    }
                    required
                    validate={required}
                    onChangeEffect={async (e) => {
                      const value = e.target.value;
                      if (value) {
                        getProtocolosPadraoPorEditalAsync(value);
                      }
                    }}
                  />
                </div>
                <div className="col-12">
                  <Field
                    component={MultiSelect}
                    label="Protocolos Padrão"
                    name="protocolos_padrao"
                    selected={values.protocolos_padrao || []}
                    options={protocolosPadrao.map((protocolo) => ({
                      label: protocolo.nome_protocolo,
                      value: protocolo.uuid,
                    }))}
                    nomeDoItemNoPlural="Protocolos Padrão"
                    onChange={(value) =>
                      form.change(`protocolos_padrao`, value)
                    }
                    placeholder={
                      !values.edital_origem
                        ? "Selecione o edital de origem"
                        : "Selecione os protocolos padrão"
                    }
                    disabled={!values.edital_origem}
                    required
                    multiple
                    validate={requiredMultiselectKhan}
                  />
                </div>
                <div className="col-12">
                  <Field
                    component={MultiSelect}
                    label="Edital de Destino"
                    name="editais_destino"
                    selected={values.editais_destino || []}
                    options={
                      editaisDestino &&
                      editaisDestino
                        .map((edital) => ({
                          label: edital.numero,
                          value: edital.uuid,
                        }))
                        .filter(
                          (edital) => edital.value !== values.edital_origem,
                        )
                    }
                    nomeDoItemNoPlural="Editais"
                    onChange={(value) => form.change(`editais_destino`, value)}
                    placeholder="Selecione os editais"
                    required
                    multiple
                    validate={requiredMultiselectKhan}
                  />
                </div>
                <div className="col-12">
                  <Field
                    component={CKEditorField}
                    label="Outras Informações"
                    name="outras_informacoes"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Botao
                texto="Cancelar"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => closeModal(false)}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end me-3"
              />
              <Botao
                texto="Vincular"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end"
                disabled={
                  submitting ||
                  !values.editais_destino ||
                  !values.edital_origem ||
                  !values.protocolos_padrao
                }
              />
            </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
};
