import React, { useState } from "react";
import { Radio } from "antd";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputFile from "src/components/Shareable/Input/InputFile";
import { Field, Form } from "react-final-form";
import { OPCOES_AVALIACAO_A_CONTENTO } from "../LancamentoPorPeriodo/helpers";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export const ModalFinalizarMedicao = ({ ...props }) => {
  const {
    showModal,
    closeModal,
    opcaoSelecionada,
    setOpcaoSelecionada,
    handleFinalizarMedicao,
    arquivo,
    setArquivo,
  } = props;

  const [disableFinalizarMedicao, setDisableFinalizarMedicao] = useState(true);
  const [showButtonAnexarPlanilha, setShowButtonAnexarPlanilha] =
    useState(false);
  const [validationFile, setValidationFile] = useState({ touched: false });
  const [desativarAnexar, setDesativarAnexar] = useState(false);

  const handleOnChange = (event) => {
    if (opcaoSelecionada === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS) {
      setArquivo([]);
    }
    if (
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.SIM_SEM_OCORRENCIAS
    ) {
      setDisableFinalizarMedicao(false);
      setShowButtonAnexarPlanilha(false);
    } else {
      arquivo.length === 0 && setDisableFinalizarMedicao(true);
      event.target.value === OPCOES_AVALIACAO_A_CONTENTO.NAO_COM_OCORRENCIAS &&
        setShowButtonAnexarPlanilha(true);
    }
    setOpcaoSelecionada(event.target.value);
  };

  const handleHideModal = () => {
    setOpcaoSelecionada(null);
    setDisableFinalizarMedicao(true);
    setShowButtonAnexarPlanilha(false);
    setArquivo([]);
    setDesativarAnexar(false);
    closeModal();
  };

  const isValidFiles = (files) => {
    let validation = { touched: true };
    let xlsCount = 0;
    let pdfCount = 0;
    files.forEach((element) => {
      const base64Ext = element.base64.split(";")[0];
      if (base64Ext.includes("pdf")) {
        pdfCount++;
        if (element.size > 10 * 1024 * 1024) {
          toastError("PDF deve ter menos de 10MB");
          setDisableFinalizarMedicao(true);
          return;
        }
        validation = { ...validation, pdf: true };
      }
      if (
        base64Ext.includes("spreadsheetml") ||
        base64Ext.includes("application/vnd.ms-excel.sheet.macroEnabled.12")
      ) {
        xlsCount++;
        if (element.size > 25 * 1024 * 1024) {
          toastError("Excel deve ter menos de 25MB");
          setDisableFinalizarMedicao(true);
          return;
        }
        validation = { ...validation, xls: true };
      }
    });

    if (xlsCount > 1 || pdfCount > 1) {
      toastError("O sistema permite apenas 1 arquivo Excel e 1 arquivo PDF");
      setDisableFinalizarMedicao(true);
      return;
    }

    if (validation.xls && validation.pdf) {
      setDisableFinalizarMedicao(false);
      setDesativarAnexar(true);
    } else {
      setDisableFinalizarMedicao(true);
    }

    setValidationFile(validation);
  };

  const removeFile = (index) => {
    let newFiles = [...arquivo];
    newFiles.splice(index, 1);
    isValidFiles(newFiles);
    setArquivo(newFiles);
    setDesativarAnexar(false);
  };

  const setFiles = (files) => {
    let arquivos = arquivo;
    arquivos = files;
    isValidFiles(arquivos);
    setArquivo(arquivos);
  };

  return (
    <Modal
      dialogClassName="modal-50w"
      show={showModal}
      backdrop="static"
      onHide={() => handleHideModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Avaliação do Serviço</Modal.Title>
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
        <div className="row">
          {showButtonAnexarPlanilha && (
            <Form
              onSubmit={() => {}}
              render={() => (
                <Field
                  component={InputFile}
                  className="inputfile"
                  dataTestId="input-anexar-arquivos"
                  alignLeft={true}
                  texto="Anexar arquivos"
                  name="files"
                  accept=".xls, .xlsm, .xlsx, .pdf"
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
                  disabled={desativarAnexar}
                />
              )}
            />
          )}
        </div>
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
              texto="Finalizar Medição"
              type={BUTTON_TYPE.BUTTON}
              onClick={async () => {
                handleFinalizarMedicao();
                handleHideModal();
              }}
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
