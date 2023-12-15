import React, { Fragment, useState } from "react";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import { Radio } from "antd";
import HTTP_STATUS from "http-status-codes";
import { OnChange } from "react-final-form-listeners";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { OPCOES_AVALIACAO_A_CONTENTO } from "../LancamentoPorPeriodo/helpers";
import InputFile from "components/Shareable/Input/InputFile";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import CKEditorField from "components/Shareable/CKEditorField";
import {
  peloMenosUmCaractere,
  textAreaRequired,
} from "helpers/fieldValidators";
import { composeValidators } from "helpers/utilities";
import { updateOcorrenciaSolicitacaoMedicaoInicial } from "services/medicaoInicial/solicitacaoMedicaoInicial.service";

export const ModalAtualizarOcorrencia = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    solicitacaoMedicaoInicial,
    onClickInfoBasicas,
    setObjSolicitacaoMIFinalizada,
  } = props;

  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [disableFinalizarMedicao, setDisableFinalizarMedicao] = useState(true);
  const [showButtonAnexarPlanilha, setShowButtonAnexarPlanilha] =
    useState(false);
  const [arquivo, setArquivo] = useState([]);
  const [validationFile, setValidationFile] = useState({ touched: false });
  const [justificativa, setJustificativa] = useState(null);

  const isValidFiles = (files) => {
    let validation = { touched: true };
    files.forEach((element) => {
      const base64Ext = element.base64.split(";")[0];
      if (base64Ext.includes("pdf")) {
        validation = {
          ...validation,
          pdf: true,
        };
      }
      if (base64Ext.includes("spreadsheetml")) {
        validation = {
          ...validation,
          xls: true,
        };
      }
    });
    if (
      validation.xls &&
      validation.pdf &&
      !["", undefined, "<p></p>", null].includes(justificativa)
    ) {
      setDisableFinalizarMedicao(false);
    } else {
      setDisableFinalizarMedicao(true);
    }
    setValidationFile(validation);
  };

  const handleOnChange = (event) => {
    if (opcaoSelecionada === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS) {
      setArquivo([]);
    }

    if (
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS &&
      !["", undefined, "<p></p>", null].includes(justificativa)
    ) {
      setDisableFinalizarMedicao(false);
      setShowButtonAnexarPlanilha(false);
    }

    if (arquivo.length === 0) {
      setDisableFinalizarMedicao(true);
    }

    if (
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS
    ) {
      setShowButtonAnexarPlanilha(true);
    } else {
      setShowButtonAnexarPlanilha(false);
    }
    setOpcaoSelecionada(event.target.value);
  };

  const removeFile = () => {
    let arquivos = arquivo;
    isValidFiles(arquivos);
    setArquivo(arquivos);
  };

  const setFiles = (files) => {
    let arquivos = arquivo;
    arquivos = files;
    isValidFiles(arquivos);
    setArquivo(arquivos);
  };

  const handleHideModal = () => {
    setOpcaoSelecionada(null);
    setDisableFinalizarMedicao(true);
    setShowButtonAnexarPlanilha(false);
    setArquivo([]);
    closeModal();
  };

  const handleFinalizarAtualizacao = async () => {
    let data = new FormData();
    data.append("com_ocorrencias", String(!opcaoSelecionada));
    data.append("justificativa", justificativa);

    if (!opcaoSelecionada) {
      let payloadAnexos = [];
      arquivo.forEach((element) => {
        payloadAnexos.push({
          nome: String(element.nome),
          base64: String(element.base64),
        });
      });
      data.append("anexos", JSON.stringify(payloadAnexos));
    }
    const response = await updateOcorrenciaSolicitacaoMedicaoInicial(
      solicitacaoMedicaoInicial.uuid,
      data
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Formulário de Ocorrências atualizado com sucesso!");
      setObjSolicitacaoMIFinalizada(response.data);
      handleHideModal();
    } else {
      toastError("Não foi possível finalizar as alterações!");
    }
    onClickInfoBasicas();
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      onHide={() => handleHideModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Atualização do Formulário de Ocorrências</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            <p className="ms-2">
              Neste mês, a direção da Unidade Educacional considera que o
              serviço foi realizado a contento?
            </p>
          </div>
        </div>
        <div className="row">
          <Radio.Group
            onChange={(event) => handleOnChange(event)}
            value={opcaoSelecionada}
          >
            <Radio
              className="radio-opt-positive"
              value={OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS}
            >
              Sim, sem ocorrências
            </Radio>
            <Radio
              className="radio-opt-negative"
              value={OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS}
            >
              Não, com ocorrências
            </Radio>
          </Radio.Group>
        </div>
        <Form
          onSubmit={() => {}}
          render={({ form }) => (
            <Fragment>
              {opcaoSelecionada !== null ? (
                <div className="col-12 mt-3">
                  <p className="mb-0">
                    Justificativa <span className="red">*</span>
                  </p>
                  <Field
                    component={CKEditorField}
                    name={"justificativa"}
                    placeholder="Justificativa"
                    required
                    validate={composeValidators(
                      textAreaRequired,
                      peloMenosUmCaractere
                    )}
                  />
                  <OnChange name="justificativa">
                    {async (value) => {
                      form.change("justificativa", value);
                      setJustificativa(value);
                      if (
                        opcaoSelecionada ===
                        OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS
                      ) {
                        if (!["", undefined, "<p></p>", null].includes(value)) {
                          setDisableFinalizarMedicao(false);
                        } else {
                          setDisableFinalizarMedicao(true);
                        }
                      } else {
                        if (
                          !["", undefined, "<p></p>", null].includes(value) &&
                          Object.keys(validationFile).includes("pdf") &&
                          Object.keys(validationFile).includes("xls")
                        ) {
                          setDisableFinalizarMedicao(false);
                        } else {
                          setDisableFinalizarMedicao(true);
                        }
                      }
                    }}
                  </OnChange>
                </div>
              ) : null}
              <div className="row ps-2">
                {showButtonAnexarPlanilha && (
                  <div className="col-12">
                    <Field
                      component={InputFile}
                      className="inputfile"
                      alignLeft={true}
                      texto="Anexar arquivos"
                      name="files"
                      accept=".xls, .xlsx, .pdf"
                      setFiles={setFiles}
                      removeFile={removeFile}
                      toastSuccess={"Arquivos anexados com sucesso!"}
                      ehPlanilhaMedicaoInicial={true}
                      validationFile={validationFile}
                      concatenarNovosArquivos={true}
                      helpText={
                        "É obrigatório anexar o relatório de ocorrências no formato Excel e também no formato PDF"
                      }
                      customHelpTextClassName="custom-style-help-text"
                    />
                  </div>
                )}
              </div>
            </Fragment>
          )}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="row">
          <div className="col-12">
            <Botao
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => handleHideModal()}
              style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
              className="ms-3"
            />
            <Botao
              texto="Finalizar Atualização"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => handleFinalizarAtualizacao()}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
              disabled={disableFinalizarMedicao}
            />
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
